'use client'

import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()
  
  const total = getCartTotal()
  const itemCount = getCartCount()
  
  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-center">Your cart is empty</CardTitle>
              <CardDescription className="text-center">
                Start adding items to your cart from the shop.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/shop">
                  Browse Shop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={`${item.productId}-${item.selectedSize || 'default'}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link href={`/shop/${item.productId}`} className="flex-shrink-0">
                        <div className="relative w-20 h-20 overflow-hidden rounded bg-muted">
                          <Image
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <Link href={`/shop/${item.productId}`}>
                          <h3 className="font-semibold line-clamp-1 hover:underline">
                            {item.productName}
                          </h3>
                        </Link>
                        {item.selectedSize && (
                          <p className="text-sm text-muted-foreground">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => removeFromCart(item.productId, item.selectedSize)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
