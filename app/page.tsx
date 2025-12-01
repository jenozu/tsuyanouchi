import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { getProducts } from "@/lib/products"

export const metadata = {
  title: "TSUYA NO UCHI — Ukiyo‑e Style Anime Art Prints",
  description:
    "Handcrafted ukiyo‑e inspired anime prints on premium paper. Soft palettes, gentle grain, timeless mood.",
}

export default async function HomePage() {
  const products = await getProducts()
  const featured = products.slice(0, 4)

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <section className="relative w-full h-[64vh] md:h-[80vh] overflow-hidden">
        <Image
          src="/images/tsuya-triple.png"
          alt="Framed ukiyo‑e style anime prints by TSUYA NO UCHI"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto h-full flex items-end px-4 md:px-6 pb-8 md:pb-10">
          <div className="text-white">
            <p className="tracking-[0.35em] uppercase text-[10px] md:text-xs opacity-90">
              TSUYA NO UCHI
            </p>
            <h1 className="mt-2 text-2xl md:text-5xl font-semibold">
              Ukiyo‑e Inspired Anime Prints
            </h1>
            <p className="mt-2 md:mt-3 max-w-xl text-sm md:text-base opacity-90">
              Modern characters painted with the softness of old Japan—muted pigments, paper grain, and the poetry of light.
            </p>
            <div className="mt-5 md:mt-6 flex gap-3">
              <Button asChild size="lg" className="bg-emerald-900 hover:bg-emerald-800 text-white">
                <Link href="/shop">Shop Prints</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="backdrop-blur border-white/50 text-white hover:bg-white/10">
                <Link href="#about">About the work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative"
        style={{
          backgroundImage: 'url("/images/paper-texture.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.65),rgba(255,255,255,0.85))]" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="rounded-xl overflow-hidden border border-zinc-200/70 shadow-sm bg-white/60">
              <Image
                src="/images/tsuya-wolves.png"
                alt="Ukiyo‑e inspired character with wolves under the moon"
                width={1200}
                height={1400}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-semibold text-zinc-900">Tradition meets anime</h2>
              <Separator className="my-3 md:my-4" />
              <p className="text-zinc-700 leading-relaxed text-sm md:text-base">
                Each illustration blends Edo‑period sensibility with contemporary character design. I work with warm palettes,
                delicate linework, and layered textures to echo woodblock prints while keeping a modern heart.
              </p>
              <ul className="mt-5 md:mt-6 grid gap-2 text-zinc-700 text-sm">
                <li>• Archival‑quality prints</li>
                <li>• Soft matte finish with subtle grain</li>
                <li>• Sizes suited for home galleries and desks</li>
              </ul>
              <div className="mt-5 md:mt-6">
                <Button asChild className="bg-emerald-900 hover:bg-emerald-800 text-white">
                  <Link href="/shop">Browse the collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="flex items-end justify-between">
            <h3 className="text-lg md:text-2xl font-semibold">Featured</h3>
            <Link href="/shop" className="text-emerald-900 hover:underline text-sm md:text-base">
              View all
            </Link>
          </div>
          <div className="mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <PreviewCard
                key={product.id}
                title={product.title}
                price={product.price}
                src={product.image}
                href={`/shop/${product.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function PreviewCard({
  title = "Art Print",
  price = 24,
  src = "/ukiyoe-anime-art-print.png",
  href = "/shop",
}: {
  title?: string
  price?: number
  src?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg overflow-hidden border bg-white hover:shadow-sm transition-shadow"
      aria-label={`View ${title} in shop`}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={src || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <div className="text-sm font-medium text-zinc-900 line-clamp-1">{title}</div>
        <div className="text-sm text-zinc-600">${price}</div>
      </div>
    </Link>
  )
}
