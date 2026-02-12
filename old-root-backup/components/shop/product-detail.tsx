"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ChevronRight, ShoppingBag } from 'lucide-react'
import ProductCard, { type Product } from "@/components/product-card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { FavoritesClient } from "@/components/favorites-client"
import { AddToCartButton } from "@/components/add-to-cart-button"

export default function ProductDetail({
  product,
  related = [],
  isFavorite = false,
}: {
  product: Product
  related?: Product[]
  isFavorite?: boolean
}) {
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]
  const [active, setActive] = useState(0)
  const [size, setSize] = useState<string>(product.sizes[0] ?? "A4")
  const [qty, setQty] = useState(1)
  const { toast } = useToast()

  const imgSizes = "(max-width:640px) 100vw, (max-width:1024px) 50vw, 600px"

  const priceText = useMemo(() => `$${product.price}`, [product.price])

  return (
    <>
      <nav className="max-w-6xl mx-auto w-full px-4 md:px-6 py-3 text-sm text-zinc-600 flex items-center gap-1">
        <Link href="/shop" className="hover:text-zinc-900">Shop</Link>
        <ChevronRight className="w-4 h-4 text-zinc-400" />
        <span className="text-zinc-900">{product.title}</span>
      </nav>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-2 gap-6 md:gap-10">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-white">
              <Image
                key={gallery[active]}
                src={gallery[active] || "/placeholder.svg"}
                alt={`${product.title} image ${active + 1}`}
                fill
                sizes={imgSizes}
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded-md border",
                    i === active ? "ring-2 ring-emerald-900" : "hover:border-zinc-300"
                  )}
                  aria-label={`Show image ${i + 1}`}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    fill
                    sizes="(max-width:640px) 20vw, 120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pl-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900">{product.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-lg text-zinc-900">{priceText}</div>
              <div className="flex gap-2">
                {product.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="bg-emerald-50 text-emerald-900 border-emerald-200">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4">
              {/* Size selector */}
              <div>
                <Label className="text-sm text-zinc-700">Size</Label>
                <RadioGroup
                  defaultValue={size}
                  onValueChange={setSize}
                  className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2"
                >
                  {product.sizes.map((s) => (
                    <div key={s}>
                      <RadioGroupItem value={s} id={`size-${s}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${s}`}
                        className={cn(
                          "flex items-center justify-center rounded-md border px-3 py-2 text-sm cursor-pointer",
                          size === s ? "bg-emerald-900 text-white border-emerald-900" : "bg-white hover:bg-zinc-50"
                        )}
                        onClick={() => setSize(s)}
                      >
                        {s}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <Label htmlFor="qty" className="text-sm text-zinc-700">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </Button>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <AddToCartButton 
                productId={product.id}
                productName={product.title}
                price={product.price}
                quantity={qty}
                selectedSize={size}
                imageUrl={product.image}
              />
              <div className="mt-2">
                <FavoritesClient productId={product.id} initialFavorite={isFavorite} />
              </div>

              {/* Description */}
              <div className="prose prose-zinc max-w-none text-sm md:text-base">
                <p className="text-zinc-700">
                  {product.description ??
                    "Printed on premium matte paper with a subtle washi‑like grain. Pigments are soft and archival for long‑lasting color."}
                </p>
                <ul className="mt-2 text-zinc-700">
                  <li>• Archival inks on matte paper</li>
                  <li>• Packed flat with protective sleeve</li>
                  <li>• Frame not included</li>
                </ul>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
            <h2 className="text-lg md:text-xl font-semibold">You may also like</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
