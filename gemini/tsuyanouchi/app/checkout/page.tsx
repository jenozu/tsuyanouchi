'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { ArrowLeft, CreditCard, Lock, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { computeTaxAmount } from '@/lib/tax';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  orderData: Record<string, unknown>;
  onSuccess: () => void;
  onError: (message: string) => void;
}

function StripePaymentForm({ clientSecret, orderId, orderData, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setIsConfirming(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? 'Please check your payment details.');
      setIsConfirming(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you?orderId=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message ?? 'Payment failed. Please try again.');
      setIsConfirming(false);
      return;
    }

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch {
      // Payment confirmed by Stripe — Stripe webhook will still fire and can recover the order.
    }

    onSuccess();
  };

  return (
    <div className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      <Button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || isConfirming}
        className="w-full flex items-center justify-center gap-2 py-3"
      >
        <Lock size={16} />
        {isConfirming ? 'Processing payment…' : 'Place Order'}
      </Button>
      <p className="text-xs text-[#786B59] text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pendingOrderData, setPendingOrderData] = useState<Record<string, unknown> | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'US' },
  });

  const watchedCountry = watch('country');
  const watchedState = watch('state');

  const subtotal = getCartTotal();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const resolvedShipping = shippingCost ?? 0;
  const taxes = computeTaxAmount(subtotal + resolvedShipping, watchedCountry || 'US', watchedState || undefined);
  const total = subtotal + resolvedShipping + taxes;

  useEffect(() => {
    if (!watchedCountry) {
      setShippingCost(null);
      return;
    }
    const q = Math.max(1, totalQuantity);
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(
          `/api/shipping/rate?country=${encodeURIComponent(watchedCountry)}&quantity=${q}`
        );
        const data = await res.json().catch(() => ({}));
        if (!cancelled && typeof data?.price === 'number') {
          setShippingCost(data.price);
        } else if (!cancelled) {
          setShippingCost(0);
        }
      } catch {
        if (!cancelled) setShippingCost(0);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [watchedCountry, totalQuantity]);

  const onContinueToPayment = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          metadata: { orderId: newOrderId, email: data.email },
        }),
      });

      if (!paymentResponse.ok) throw new Error('Failed to initialize payment');

      const { clientSecret: secret, paymentIntentId } = await paymentResponse.json();

      const orderData = {
        order_id: newOrderId,
        email: data.email,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.selectedSize?.price || item.price,
          selectedSize: item.selectedSize?.label,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        taxes,
        shipping: resolvedShipping,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_intent_id: paymentIntentId,
        shipping_address: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      };

      setOrderId(newOrderId);
      setClientSecret(secret);
      setPendingOrderData(orderData);
      setPaymentStep('payment');
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentError('Could not initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/thank-you?orderId=${orderId}`);
  };

  const handleBackToShipping = () => {
    setPaymentStep('shipping');
    setClientSecret(null);
    setPaymentError(null);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F8F4]">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-serif text-[#2D2A26] mb-4">Your cart is empty</h1>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F4]">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/cart" className="inline-flex items-center text-sm text-[#786B59] hover:text-[#2D2A26] mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-serif text-[#2D2A26] mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping Information */}
              <div className={`bg-white border border-[#E5E0D8] p-6 transition-opacity ${paymentStep === 'payment' ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                <h2 className="text-xl font-serif text-[#2D2A26] mb-6">Shipping Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">First Name</label>
                    <input
                      {...register('firstName')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    />
                    {errors.firstName && <p className="text-xs text-[#8C3F3F] mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">Last Name</label>
                    <input
                      {...register('lastName')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    />
                    {errors.lastName && <p className="text-xs text-[#8C3F3F] mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#2D2A26] mb-2">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                  />
                  {errors.email && <p className="text-xs text-[#8C3F3F] mt-1">{errors.email.message}</p>}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#2D2A26] mb-2">Address</label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                  />
                  {errors.address && <p className="text-xs text-[#8C3F3F] mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">City</label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    />
                    {errors.city && <p className="text-xs text-[#8C3F3F] mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">State/Province</label>
                    <input
                      {...register('state')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    />
                    {errors.state && <p className="text-xs text-[#8C3F3F] mt-1">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">Postal Code</label>
                    <input
                      {...register('postalCode')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    />
                    {errors.postalCode && <p className="text-xs text-[#8C3F3F] mt-1">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2A26] mb-2">Country</label>
                    <select
                      {...register('country')}
                      className="w-full px-4 py-2 border border-[#E5E0D8] bg-[#F9F8F4] focus:outline-none focus:border-[#2D2A26]"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="JP">Japan</option>
                      <option value="AT">Austria</option>
                      <option value="BE">Belgium</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="IE">Ireland</option>
                      <option value="IT">Italy</option>
                      <option value="NL">Netherlands</option>
                      <option value="ES">Spain</option>
                      <option value="SE">Sweden</option>
                      <option value="CH">Switzerland</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                    </select>
                    {errors.country && <p className="text-xs text-[#8C3F3F] mt-1">{errors.country.message}</p>}
                  </div>
                </div>
              </div>

              {/* Step 1: Continue to Payment button */}
              {paymentStep === 'shipping' && (
                <form onSubmit={handleSubmit(onContinueToPayment)}>
                  {paymentError && (
                    <p className="text-sm text-[#8C3F3F] mb-3">{paymentError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isProcessing || shippingCost === null}
                  >
                    <CreditCard size={20} />
                    {isProcessing ? 'Initializing payment…' : 'Continue to Payment'}
                  </Button>
                </form>
              )}

              {/* Step 2: Stripe payment section */}
              {paymentStep === 'payment' && clientSecret && (
                <div className="bg-white border-2 border-[#2D2A26] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-[#2D2A26]">Payment</h2>
                    <button
                      type="button"
                      onClick={handleBackToShipping}
                      className="text-sm text-[#786B59] hover:text-[#2D2A26] flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={14} />
                      Edit shipping
                    </button>
                  </div>

                  {paymentError && (
                    <div className="mb-4 p-3 bg-[#8C3F3F]/10 border border-[#8C3F3F]/30 text-sm text-[#8C3F3F]">
                      {paymentError}
                    </div>
                  )}

                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#2D2A26',
                          colorBackground: '#F9F8F4',
                          colorText: '#2D2A26',
                          colorDanger: '#8C3F3F',
                          borderRadius: '0px',
                          fontFamily: 'inherit',
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      clientSecret={clientSecret}
                      orderId={orderId!}
                      orderData={pendingOrderData!}
                      onSuccess={handlePaymentSuccess}
                      onError={(msg) => setPaymentError(msg)}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E5E0D8] p-6 sticky top-28">
                <h2 className="text-xl font-serif text-[#2D2A26] mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 border border-[#E5E0D8] relative overflow-hidden">
                        <Image src={item.imageUrl || 'https://picsum.photos/64/64'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2D2A26]">{item.name}</p>
                        {item.selectedSize && <p className="text-xs text-[#786B59]">Size: {item.selectedSize.label}</p>}
                        <p className="text-xs text-[#786B59]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#2D2A26]">
                        ${((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-[#E5E0D8] pt-4">
                  <div className="flex justify-between text-[#4A4036]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#4A4036]">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === null ? '—' : resolvedShipping === 0 ? 'FREE' : `$${resolvedShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#4A4036]">
                    <span>Tax</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#E5E0D8] pt-3">
                    <div className="flex justify-between text-lg font-medium text-[#2D2A26]">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#786B59] text-center mt-6">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
