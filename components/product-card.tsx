"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { FavoritesClient } from "@/components/favorites-client"
import { Heart } from "lucide-react"

export type Product = {
  id: string
  title: string
  price: number
  image: string
  sizes: string[]
  tags: string[]
  inStock?: boolean
  description?: string
  gallery?: string[]
}

export default function ProductCard({
  product = {
    id: "sample",
    title: "Art Print",
    price: 24,
    image: "/ukiyoe-art.png",
    sizes: ["A4"],
    tags: ["blossom"],
    inStock: true,
  },
  isFavorite = false,
}: {
  product?: Product
  isFavorite?: boolean
}) {
  return (
    <Card className="overflow-hidden bg-white group">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-[3/4]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width:640px) 100vw, (max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
            <FavoritesClient productId={product.id} initialFavorite={isFavorite} />
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/shop/${product.id}`}>
          <div className="text-sm font-medium text-zinc-900 line-clamp-1 hover:underline">{product.title}</div>
        </Link>
        <div className="text-sm text-zinc-600">${product.price}</div>
        <div className="mt-1 text-xs text-zinc-500 line-clamp-1">Sizes: {product.sizes.join(", ")}</div>
        {product.description && (
          <div className="mt-1 text-xs text-zinc-500 line-clamp-3">{product.description}</div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <AddToCartButton
          productId={product.id}
          productName={product.title}
          price={product.price}
          quantity={1}
          selectedSize={product.sizes[0]}
          imageUrl={product.image}
        />
      </CardFooter>
    </Card>
  )
}
