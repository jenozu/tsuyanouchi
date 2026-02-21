'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/supabase-helpers';
import { Search } from 'lucide-react';

interface ShopClientProps {
  products: Product[];
}

type SortOption = 'best-seller' | 'price-low-high' | 'price-high-low' | 'newest' | 'alpha-a-z' | 'alpha-z-a';

export function ShopClient({ products }: ShopClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'NEW ARRIVALS' },
    { value: 'best-seller', label: 'BEST SELLERS' },
    { value: 'price-low-high', label: 'PRICE: LOW TO HIGH' },
    { value: 'price-high-low', label: 'PRICE: HIGH TO LOW' },
    { value: 'alpha-a-z', label: 'ALPHABETICALLY: A-Z' },
    { value: 'alpha-z-a', label: 'ALPHABETICALLY: Z-A' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'newest':
          return (b.created_at || '').localeCompare(a.created_at || '');
        case 'best-seller':
          return (b.created_at || '').localeCompare(a.created_at || '');
        case 'alpha-a-z':
          return a.name.localeCompare(b.name);
        case 'alpha-z-a':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      <div className="bg-[#F9F8F4] border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-serif text-[#2D2A26] mb-4">The Collection</h1>
          <p className="text-[#786B59] max-w-2xl mx-auto font-serif italic">Explore our full range of curated items.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort & Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-[#786B59] font-medium whitespace-nowrap">SORT BY:</span>
              <div className="flex flex-wrap gap-1">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-all whitespace-nowrap ${
                      sortBy === option.value
                        ? 'bg-[#2D2A26] text-white'
                        : 'bg-transparent text-[#786B59] hover:text-[#2D2A26]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative md:ml-auto w-full md:w-80">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E0D8] bg-white text-sm focus:outline-none focus:border-[#2D2A26] text-[#2D2A26] placeholder-[#786B59]"
              />
              <Search className="absolute left-3 top-2.5 text-[#786B59]" size={16} />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20 text-[#786B59]">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
