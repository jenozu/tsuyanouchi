'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Mail } from "lucide-react"
import Link from "next/link"
import { Order } from "@/lib/supabase-helpers"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
        }
      } catch (error) {
        console.error('Error loading order:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavbarWrapper />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!orderId) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavbarWrapper />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">No Order Found</CardTitle>
              <CardDescription className="text-center">
                We couldn't find the order you're looking for.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/shop">Back to Shop</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 md:py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Thank You for Your Order!</h1>
          <p className="text-muted-foreground text-lg">
            Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Confirmation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
            <CardDescription>
              We've sent a confirmation email with your order details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Package className="w-5 h-5 mt-0.5 text-emerald-900" />
              <div>
                <p className="font-semibold">Order Number</p>
                <p className="text-sm text-muted-foreground">{orderId}</p>
              </div>
            </div>

            {order && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <Mail className="w-5 h-5 mt-0.5 text-emerald-900" />
                <div>
                  <p className="font-semibold">Confirmation Email Sent To</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {order && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      {item.selectedSize && (
                        <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Shipping Address</p>
                <div className="text-sm text-muted-foreground">
                  <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with your order details and tracking information.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Processing</p>
                <p className="text-sm text-muted-foreground">
                  We'll carefully prepare your order for shipment.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Shipping</p>
                <p className="text-sm text-muted-foreground">
                  Your order will be shipped and you'll receive tracking information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="flex-1 sm:flex-initial">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Need help with your order?</p>
          <p>
            Contact us at{' '}
            <a href="mailto:support@tsuyanouchi.com" className="text-emerald-900 hover:underline">
              support@tsuyanouchi.com
            </a>
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col">
          <NavbarWrapper />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
          <Footer />
        </main>
      }
    >
      <ThankYouContent />
    </Suspense>
  )
}
