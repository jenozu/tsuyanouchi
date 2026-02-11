"use client"

import Link from "next/link"
import { Menu, ShoppingBag, Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@/components/auth/signout-button"

interface NavbarProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  } | null
}

export default function Navbar({ session }: NavbarProps) {
  const { getCartCount } = useCart()
  const { getFavoritesCount } = useFavorites()
  
  const cartCount = getCartCount()
  const favoritesCount = getFavoritesCount()
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
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30 relative"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-900 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
              <span className="sr-only">Favourites</span>
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-900 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="inline-grid h-10 w-10 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {session.user?.name}
                    <div className="text-xs text-muted-foreground font-normal">{session.user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
                aria-label="Sign in"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="sr-only">Sign in</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile: icons + menu */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/favourites"
            aria-label="Favourites"
            className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30 relative"
          >
            <Heart className="h-5 w-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-900 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
            <span className="sr-only">Favourites</span>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30 relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-900 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="inline-grid h-10 w-10 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
                  aria-label="Account menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {session.user?.name}
                  <div className="text-xs text-muted-foreground font-normal">{session.user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-grid h-10 w-10 place-items-center rounded-full text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900/30"
              aria-label="Sign in"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="sr-only">Sign in</span>
            </Link>
          )}

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
                {session ? (
                  <>
                    <Link href="/account" className="text-zinc-700 hover:text-zinc-900">
                      Account
                    </Link>
                    <SignOutButton />
                  </>
                ) : (
                  <Link href="/auth/signin" className="text-zinc-700 hover:text-zinc-900">
                    Sign In
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
