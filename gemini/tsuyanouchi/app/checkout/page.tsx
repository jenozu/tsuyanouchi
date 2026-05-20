'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { ArrowLeft, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, checkoutUrl, isLoading } = useCart();
  const subtotal = getCartTotal();

  const handleCheckout = () => {
    if (checkoutUrl) window.location.href = checkoutUrl;
  };

  if (cartItems.length === 0 && !isLoading) {
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
            {/* Checkout action */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E5E0D8] p-6">
                <h2 className="text-xl font-serif text-[#2D2A26] mb-4">Secure Checkout</h2>
                <p className="text-[#786B59] text-sm mb-6">
                  You will be redirected to Shopify's secure checkout to complete your purchase, where you can enter your shipping address and payment details.
                </p>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || !checkoutUrl}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <Lock size={18} />
                  {isLoading ? 'Loading…' : 'Complete Purchase'}
                </Button>
                <p className="text-xs text-[#786B59] text-center mt-3">
                  Secure checkout powered by Shopify. Your payment information is encrypted and protected.
                </p>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E5E0D8] p-6 sticky top-28">
                <h2 className="text-xl font-serif text-[#2D2A26] mb-6">Order summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 border border-[#E5E0D8] relative overflow-hidden">
                        <Image
                          src={item.imageUrl || 'https://picsum.photos/64/64'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2D2A26]">{item.name}</p>
                        {item.selectedSize && (
                          <p className="text-xs text-[#786B59]">Size: {item.selectedSize.label}</p>
                        )}
                        <p className="text-xs text-[#786B59]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#2D2A26]">
                        ${((item.selectedSize?.price ?? item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-[#E5E0D8] pt-4">
                  <div className="flex justify-between text-[#4A4036]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#4A4036] text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-[#4A4036] text-sm">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-[#2D2A26] border-t border-[#E5E0D8] pt-3">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-[#786B59] text-center mt-6">
                  By continuing, you agree to our terms and conditions.
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
