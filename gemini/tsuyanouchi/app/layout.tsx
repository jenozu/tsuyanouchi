import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { FavoritesProvider } from '@/lib/favorites-context';

export const metadata: Metadata = {
  title: 'Tsuyanouchi | House of Lustre',
  description: 'A curated collection of luxury lifestyle goods for the discerning individual.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
