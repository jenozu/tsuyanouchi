'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  shippingRateId: z.string().min(1, 'Please select a shipping method'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface ShippingRate {
  id: string;
  name: string;
  country_code: string;
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'US',
    },
  });

  const watchedCountry = watch('country');
  const watchedShippingRateId = watch('shippingRateId');

  const subtotal = getCartTotal();
  const taxRate = 0.10; // 10% tax rate
  const taxes = subtotal * taxRate;
  const shippingCost = selectedShippingRate?.price || 0;
  const total = subtotal + taxes + shippingCost;

  // Load shipping rates
  useEffect(() => {
    async function loadShippingRates() {
      try {
        const response = await fetch('/api/shipping/rates');
        const rates = await response.json();
        setShippingRates(rates);
      } catch (error) {
        console.error('Error loading shipping rates:', error);
      }
    }
    loadShippingRates();
  }, []);

  // Update selected shipping rate when selection changes
  useEffect(() => {
    if (watchedShippingRateId) {
      const rate = shippingRates.find(r => r.id === watchedShippingRateId);
      setSelectedShippingRate(rate || null);
    }
  }, [watchedShippingRateId, shippingRates]);

  // Filter shipping rates by country
  const availableRates = shippingRates.filter(
    rate => rate.country_code === watchedCountry || rate.country_code === 'INTL'
  );

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create payment intent
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          metadata: {
            orderId,
            email: data.email,
          },
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { paymentIntentId } = await paymentResponse.json();

      // Create order in Supabase
      const orderData = {
        order_id: orderId,
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
        shipping: shippingCost,
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

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      // Clear cart and redirect to thank you page
      clearCart();
      router.push(`/thank-you?orderId=${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Shipping Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E5E0D8] p-6">
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
                      </select>
                      {errors.country && <p className="text-xs text-[#8C3F3F] mt-1">{errors.country.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white border border-[#E5E0D8] p-6">
                  <h2 className="text-xl font-serif text-[#2D2A26] mb-6">Shipping Method</h2>
                  <div className="space-y-3">
                    {availableRates.map(rate => (
                      <label key={rate.id} className="flex items-center p-4 border border-[#E5E0D8] hover:border-[#2D2A26] cursor-pointer">
                        <input
                          type="radio"
                          {...register('shippingRateId')}
                          value={rate.id}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-[#2D2A26]">{rate.name}</p>
                        </div>
                        <p className="font-medium text-[#2D2A26]">${rate.price.toFixed(2)}</p>
                      </label>
                    ))}
                  </div>
                  {errors.shippingRateId && <p className="text-xs text-[#8C3F3F] mt-2">{errors.shippingRateId.message}</p>}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-[#E5E0D8] p-6 sticky top-28">
                  <h2 className="text-xl font-serif text-[#2D2A26] mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover border border-[#E5E0D8]" />
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
                      <span>${shippingCost.toFixed(2)}</span>
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

                  <Button
                    type="submit"
                    className="w-full mt-6 flex items-center justify-center gap-2"
                    disabled={isProcessing}
                  >
                    <CreditCard size={20} />
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-[#786B59] text-center mt-4">
                    By placing your order, you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
