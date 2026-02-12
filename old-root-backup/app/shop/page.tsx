import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import ShopGrid from "@/components/shop/shop-grid"
import { getProducts } from "@/lib/products"

export const metadata = {
  title: "Shop Prints — TSUYA NO UCHI",
  description: "Browse ukiyo‑e inspired anime prints in various sizes and themes.",
}

export default async function ShopPage() {
  const products = await getProducts()
  const favoriteIds: string[] = [] // Favorites now managed client-side

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <section
        className="relative border-b"
        style={{
          backgroundImage: 'url("/images/paper-texture.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-semibold">Shop Prints</h1>
          <p className="mt-2 text-zinc-700">
            Soft palettes, muted grain, and modern characters—select a size and theme to suit your space.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <ShopGrid initialProducts={products} favoriteIds={favoriteIds} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
