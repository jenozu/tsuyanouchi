"use client"

import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Menu, ShoppingBag, User, Heart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const { toast } = useToast()

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <div className="max-w-6xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="tracking-[0.3em] text-xs uppercase text-emerald-900">
            TSUYA NO UCHI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-900">
            Home
          </Link>
          <Link href="/shop" className="text-sm text-zinc-700 hover:text-zinc-900">
            Shop
          </Link>

          {/* Icon-only actions (no boxes) */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/favourites"
              aria-label="Favourites"
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favourites</span>
            </Link>

            <button
              aria-label="Cart"
              onClick={() =>
                toast({
                  title: "Cart coming soon",
                  description: "Checkout will be added. For now, explore the collection.",
                })
              }
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </button>

            <Link
              href="/account"
              aria-label="Account"
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </div>
        </nav>

        {/* Mobile: icons + menu */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/favourites"
            aria-label="Favourites"
            className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Favourites</span>
          </Link>

          <button
            aria-label="Cart"
            onClick={() =>
              toast({
                title: "Cart coming soon",
                description: "Checkout will be added. For now, explore the collection.",
              })
            }
            className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </button>

          <Link
            href="/account"
            aria-label="Account"
            className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="tracking-[0.3em] text-xs uppercase text-emerald-900">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-3 text-sm">
                <Link href="/" className="text-zinc-700 hover:text-zinc-900">
                  Home
                </Link>
                <Link href="/shop" className="text-zinc-700 hover:text-zinc-900">
                  Shop
                </Link>
                <Link href="/favourites" className="text-zinc-700 hover:text-zinc-900">
                  Favourites
                </Link>
                <Link href="/account" className="text-zinc-700 hover:text-zinc-900">
                  Account
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
