import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product, ViewState } from '../types';
import { Button } from '../components/ui/Button';

interface FavouritesProps {
  products: Product[];
  favourites: string[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleFavourite: (id: string) => void;
  onNavigate: (view: ViewState) => void;
}

export const Favourites: React.FC<FavouritesProps> = ({ 
  products, 
  favourites, 
  onAddToCart, 
  onProductClick,
  onToggleFavourite,
  onNavigate
}) => {
  const favouriteProducts = products.filter(p => favourites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif text-[#2D2A26] mb-2 text-center">Your Wishlist</h1>
        <p className="text-[#786B59] text-center mb-12 font-serif italic">Saved items for your consideration.</p>

        {favouriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#F2EFE9] border border-[#E5E0D8]">
            <p className="text-[#786B59] mb-6 text-lg">You haven't saved any items yet.</p>
            <Button onClick={() => onNavigate(ViewState.SHOP)}>Browse Collection</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favouriteProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onClick={onProductClick}
                isFavourite={true}
                onToggleFavourite={onToggleFavourite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};