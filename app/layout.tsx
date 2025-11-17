import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'TSUYA NO UCHI — Ukiyo‑e Style Anime Art Prints',
  description: 'Handcrafted ukiyo‑e inspired anime prints on premium paper. Soft palettes, gentle grain, timeless mood.',
  generator: 'Next.js',
  openGraph: {
    title: 'TSUYA NO UCHI — Ukiyo‑e Style Anime Art Prints',
    description: 'Handcrafted ukiyo‑e inspired anime prints on premium paper. Soft palettes, gentle grain, timeless mood.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
