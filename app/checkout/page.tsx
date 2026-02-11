'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  shippingRateId: z.string().min(1, "Please select a shipping method"),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface ShippingRate {
  id: string
  name: string
  country_code: string
  price: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart } = useCart()
  const { toast } = useToast()
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [selectedShippingRate, setSelectedShippingRate] = useState<ShippingRate | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'US',
    },
  })

  const watchedCountry = watch('country')
  const watchedShippingRateId = watch('shippingRateId')

  const subtotal = getCartTotal()
  const taxRate = 0.10 // 10% tax rate
  const taxes = subtotal * taxRate
  const shippingCost = selectedShippingRate?.price || 0
  const total = subtotal + taxes + shippingCost

  // Load shipping rates
  useEffect(() => {
    async function loadShippingRates() {
      try {
        const response = await fetch('/api/shipping/rates')
        const rates = await response.json()
        setShippingRates(rates)
      } catch (error) {
        console.error('Error loading shipping rates:', error)
        toast({
          title: "Error",
          description: "Failed to load shipping rates. Please refresh the page.",
          variant: "destructive",
        })
      }
    }
    loadShippingRates()
  }, [toast])

  // Update selected shipping rate when selection changes
  useEffect(() => {
    if (watchedShippingRateId) {
      const rate = shippingRates.find(r => r.id === watchedShippingRateId)
      setSelectedShippingRate(rate || null)
    }
  }, [watchedShippingRateId, shippingRates])

  // Filter shipping rates by country
  const availableRates = shippingRates.filter(
    rate => rate.country_code === watchedCountry || rate.country_code === 'INTL'
  )

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Create order in Supabase
      const orderData = {
        order_id: orderId,
        email: data.email,
        items: cart,
        subtotal,
        taxes,
        shipping: shippingCost,
        total,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()

      // For now, simulate payment success and redirect to thank you page
      // In the next phase, this will integrate with Stripe
      toast({
        title: "Order Created",
        description: "Your order has been created successfully!",
      })

      clearCart()
      router.push(`/thank-you?order_id=${orderId}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavbarWrapper />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Empty Cart</CardTitle>
              <CardDescription className="text-center">
                Your cart is empty. Add items to proceed to checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/shop">Browse Shop</Link>
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
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Checkout Form */}
            <div className="md:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" {...register('firstName')} />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" {...register('lastName')} />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" {...register('address')} />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register('city')} />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" {...register('state')} />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" {...register('postalCode')} />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={watchedCountry}
                        onValueChange={(value) => setValue('country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="INTL">International</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableRates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No shipping rates available for selected country
                    </p>
                  ) : (
                    availableRates.map((rate) => (
                      <label
                        key={rate.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            value={rate.id}
                            {...register('shippingRateId')}
                            className="h-4 w-4"
                          />
                          <div>
                            <p className="font-medium">{rate.name}</p>
                          </div>
                        </div>
                        <p className="font-semibold">${rate.price.toFixed(2)}</p>
                      </label>
                    ))
                  )}
                  {errors.shippingRateId && (
                    <p className="text-sm text-destructive mt-1">{errors.shippingRateId.message}</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment will be added in Phase 4 */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Stripe payment integration will be added in the next phase
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={`${item.productId}-${item.selectedSize || 'default'}`} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded">
                          <Image
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.productName}
                            fill
                            className="object-cover rounded"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                          {item.selectedSize && (
                            <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%)</span>
                      <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing || cart.length === 0}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Note: Payment processing will be added with Stripe in Phase 4
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </main>
  )
}
