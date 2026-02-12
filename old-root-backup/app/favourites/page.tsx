'use client'

import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"
import { useEffect, useState } from "react"

interface Product {
  id: string
  title: string
  price: number
  image: string
  category: string
}

export default function FavouritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const { addToCart } = useCart()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavoriteProducts() {
      try {
        const response = await fetch('/api/products')
        const allProducts = await response.json()
        const filtered = allProducts.filter((p: any) => favorites.includes(p.id))
        setFavoriteProducts(filtered)
      } catch (error) {
        console.error('Error loading favorite products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteProducts()
  }, [favorites])

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price,
      productName: product.title,
      imageUrl: product.image,
    })
  }

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

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">My Favourites</h1>
          <p className="text-muted-foreground">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-center">No favourites yet</CardTitle>
              <CardDescription className="text-center">
                Start exploring our collection and save your favourite prints.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                  <CardDescription>${product.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => removeFavorite(product.id)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
