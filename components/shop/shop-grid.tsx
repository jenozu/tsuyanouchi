"use client"

import { useMemo, useState } from "react"
import ProductCard, { type Product } from "@/components/product-card"
import Filters, { type FiltersState } from "@/components/shop/filters"

export default function ShopGrid({
  initialProducts = [],
  favoriteIds = [],
}: {
  initialProducts?: Product[]
  favoriteIds?: string[]
}) {
  const [filters, setFilters] = useState<FiltersState>({ size: "all", tag: "all" })

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const sizeOk = filters.size === "all" ? true : p.sizes.includes(filters.size)
      const tagOk = filters.tag === "all" ? true : p.tags.includes(filters.tag)
      return sizeOk && tagOk
    })
  }, [initialProducts, filters])

  return (
    <div className="grid gap-4">
      <Filters
        sizes={[...new Set(initialProducts.flatMap((p) => p.sizes))]}
        tags={[...new Set(initialProducts.flatMap((p) => p.tags))]}
        value={filters}
        onChange={setFilters}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} isFavorite={favoriteIds.includes(p.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-zinc-600 py-10">No prints match your filters.</div>
      )}
    </div>
  )
}
