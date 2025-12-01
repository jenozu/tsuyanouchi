import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: (product: Product) => void;
  isFavourite?: boolean;
  onToggleFavourite?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick,
  isFavourite,
  onToggleFavourite
}) => {
  return (
    <div 
      onClick={() => onClick && onClick(product)}
      className="group relative bg-[#F9F8F4] border border-[#E5E0D8] hover:border-[#CDC6BC] transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden bg-[#F2EFE9] relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Favourite Button */}
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavourite) onToggleFavourite(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#F9F8F4]/90 backdrop-blur-sm hover:bg-white text-[#2D2A26] transition-all duration-200 z-10 shadow-sm"
        >
            <Heart size={18} className={isFavourite ? "fill-[#8C3F3F] text-[#8C3F3F]" : "text-[#2D2A26]"} />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 right-4 bg-[#F9F8F4] p-3 rounded-full shadow-md translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#2D2A26] hover:text-[#F9F8F4] z-10"
          aria-label="Add to cart"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
      <div className="p-5 space-y-1 bg-[#F9F8F4]">
        <p className="text-xs text-[#786B59] uppercase tracking-wider">{product.category}</p>
        <h3 className="text-lg font-serif text-[#2D2A26] group-hover:text-black">
          {product.name}
        </h3>
        <p className="text-[#4A4036] font-medium">
            {product.sizes && product.sizes.length > 0 
                ? `From $${Math.min(...product.sizes.map(s => s.price)).toLocaleString()}`
                : `$${product.price.toLocaleString()}`
            }
        </p>
      </div>
    </div>
  );
};