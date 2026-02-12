'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/lib/supabase-helpers';
import { Search } from 'lucide-react';

interface ShopClientProps {
  products: Product[];
}

export function ShopClient({ products }: ShopClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      <div className="bg-[#F9F8F4] border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-serif text-[#2D2A26] mb-4">The Collection</h1>
          <p className="text-[#786B59] max-w-2xl mx-auto font-serif italic">Explore our full range of curated items.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-[#2D2A26] text-[#F9F8F4] shadow-md' 
                    : 'bg-[#F2EFE9] text-[#4A4036] hover:bg-[#E5E0D8] border border-[#E5E0D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E0D8] bg-[#F2EFE9] rounded-none focus:outline-none focus:border-[#2D2A26] focus:ring-0 text-[#2D2A26] placeholder-[#786B59]"
            />
            <Search className="absolute left-3 top-2.5 text-[#786B59]" size={18} />
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-[#786B59]">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
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
