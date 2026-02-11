import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, Package } from "lucide-react"
import Link from "next/link"
import { getCart, getCartItemCount, getCartTotal } from "@/lib/cart-storage"
import { getFavorites } from "@/lib/favorites-storage"

export const metadata = {
  title: "My Account — TSUYA NO UCHI",
  description: "Your account dashboard.",
}

export default async function AccountPage() {
  const cartCount = await getCartItemCount()
  const cartTotal = await getCartTotal()
  const favoritesCount = (await getFavorites()).length
  
  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account, orders, and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Sign in to view and manage your profile information.
              </CardDescription>
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5" />
                <CardTitle>Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                View your order history and track shipments.
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                Coming soon in Phase 5
              </p>
            </CardContent>
          </Card>

          {/* Favourites Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <CardTitle>Favourites</CardTitle>
                </div>
                <span className="text-2xl font-semibold">{favoritesCount}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {favoritesCount === 0 
                  ? "No saved items yet. Start adding your favourite prints!"
                  : `${favoritesCount} ${favoritesCount === 1 ? 'item' : 'items'} saved`}
              </CardDescription>
              <Button variant="outline" asChild>
                <Link href="/favourites">View Favourites</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Cart Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  <CardTitle>Shopping Cart</CardTitle>
                </div>
                <span className="text-2xl font-semibold">{cartCount}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">
                {cartCount === 0 
                  ? "Your cart is empty"
                  : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} • $${cartTotal.toFixed(2)}`}
              </CardDescription>
              <Button variant="outline" asChild className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Features</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Full account functionality including authentication, order tracking, and saved preferences 
              will be available in Phase 2-5 of our implementation roadmap.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

