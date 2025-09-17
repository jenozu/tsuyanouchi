"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

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
}: {
  product?: Product
}) {
  const { toast } = useToast()

  return (
    <Card className="overflow-hidden bg-white group">
      <div className="relative aspect-[3/4]">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <CardContent className="p-3">
        <div className="text-sm font-medium text-zinc-900 line-clamp-1">{product.title}</div>
        <div className="text-sm text-zinc-600">${product.price}</div>
        <div className="mt-1 text-xs text-zinc-500 line-clamp-1">Sizes: {product.sizes.join(", ")}</div>
        {product.description && (
          <div className="mt-1 text-xs text-zinc-500 line-clamp-3">{product.description}</div>
        )}
      </CardContent>
      <CardFooter className="p-3">
        <Button
          className="w-full bg-emerald-900 hover:bg-emerald-800 text-white"
          onClick={() =>
            toast({
              title: "Added to cart (demo)",
              description: "Checkout and real cart will be added later.",
            })
          }
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  )
}
