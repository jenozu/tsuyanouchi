import type { Product } from "@/components/product-card"
import { client } from '@/sanity/lib/client'
import { PRODUCTS_QUERY, PRODUCT_QUERY } from '@/sanity/lib/queries'

// Fallback products for when Sanity isn't configured
const fallbackProducts: Product[] = [
  {
    id: "hydrangea-triptych",
    title: "Hydrangea Sisters Triptych",
    price: 48,
    image: "/images/tsuya-triple.png",
    gallery: ["/images/tsuya-triple.png"],
    sizes: ["A4", "A3"],
    tags: ["blossom", "portrait", "nature"],
    description:
      "A serene triptych of sisters among hydrangea blooms. Muted violets and moss greens on warm paper evoke classic woodblock tones.",
    inStock: true,
  },
  {
    id: "moon-wolves",
    title: "Moon & Wolves",
    price: 32,
    image: "/images/tsuya-wolves.png",
    gallery: ["/images/tsuya-wolves.png"],
    sizes: ["A5", "A4", "11x14"],
    tags: ["nature", "portrait"],
    description:
      "Under a pale moon, a warrior stands with her wolves. Teal and parchment hues echo night air and forest silence.",
    inStock: true,
  },
  {
    id: "blossom-reverie",
    title: "Blossom Reverie",
    price: 28,
    image: "/ukiyoe-anime-cherry-blossom.png",
    gallery: ["/ukiyoe-anime-cherry-blossom.png"],
    sizes: ["A5", "A4"],
    tags: ["blossom", "portrait"],
    description:
      "Petals drifting like thoughts at dusk. Soft pinks and sepia lines blend anime sensibility with ukiyo‑e calm.",
    inStock: true,
  },
  {
    id: "forest-spirit",
    title: "Forest Spirit",
    price: 28,
    image: "/ukiyoe-forest-spirit.png",
    gallery: ["/ukiyoe-forest-spirit.png"],
    sizes: ["A4", "A3"],
    tags: ["nature"],
    description:
      "A quiet guardian among cedars. Layered textures and gentle light recall handmade paper and woodgrain.",
    inStock: true,
  },
  {
    id: "yokai-dream",
    title: "Yōkai Dream",
    price: 30,
    image: "/ukiyoe-yokai-anime-girl.png",
    gallery: ["/ukiyoe-yokai-anime-girl.png"],
    sizes: ["A5", "A4", "A3"],
    tags: ["yokai", "portrait"],
    description:
      "Between worlds, a smile in the lantern-glow. Whispered folklore rendered in contemporary lines.",
    inStock: true,
  },
  {
    id: "misty-teal",
    title: "Misty Teal Garden",
    price: 26,
    image: "/ukiyoe-anime-garden-teal-beige.png",
    gallery: ["/ukiyoe-anime-garden-teal-beige.png"],
    sizes: ["A5", "A4"],
    tags: ["nature", "blossom"],
    description:
      "Mint‑teal foliage and parchment skies. A piece that feels like morning air on rice paper.",
    inStock: true,
  },
]

export async function getProducts(): Promise<Product[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return fallbackProducts
    }
    const products = await client.fetch(PRODUCTS_QUERY)
    return products
  } catch (error) {
    console.warn('Failed to fetch from Sanity, using fallback products:', error)
    return fallbackProducts
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return fallbackProducts.find(p => p.id === slug) || null
    }
    const product = await client.fetch(PRODUCT_QUERY, { slug })
    return product
  } catch (error) {
    console.warn('Failed to fetch product from Sanity, using fallback:', error)
    return fallbackProducts.find(p => p.id === slug) || null
  }
}

// Keep the old export for backward compatibility
export const products = fallbackProducts
