import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundImage: 'url("/images/paper-texture.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        <div>
          <div className="tracking-[0.3em] text-xs uppercase text-emerald-900">TSUYA NO UCHI</div>
          <p className="mt-3 text-sm text-zinc-700">
            Ukiyo‑e inspired anime art prints. Crafted with a love for paper, pigment, and quiet stories.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium">Explore</div>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/shop" className="text-zinc-700 hover:text-zinc-900">
                Shop
              </Link>
            </li>
            <li>
              <a href="#about" className="text-zinc-700 hover:text-zinc-900">
                About
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium">Contact</div>
          <p className="mt-2 text-zinc-700">
            For commissions or wholesale, email{" "}
            <a className="underline" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
