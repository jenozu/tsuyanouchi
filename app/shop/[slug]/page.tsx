import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductDetail from "@/components/shop/product-detail"
import { getProducts, getProduct } from "@/lib/products"

type Params = { slug: string }

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}
  return {
    title: `${product.title} — TSUYA NO UCHI`,
    description: product.description ?? "Ukiyo‑e inspired anime print.",
    openGraph: {
      title: `${product.title} — TSUYA NO UCHI`,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const [product, allProducts] = await Promise.all([
    getProduct(params.slug),
    getProducts()
  ])
  
  if (!product) return notFound()

  const related = allProducts
    .filter((p) => p.id !== product.id && p.tags.some((t) => product.tags.includes(t)))
    .slice(0, 4)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <ProductDetail product={product} related={related} />
      <Footer />
    </main>
  )
}
