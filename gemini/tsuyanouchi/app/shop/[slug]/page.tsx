import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProductDetailClient } from './product-detail-client';
import { getProductByHandle } from '@/lib/shopify';

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F4]">
      <Navbar />
      <main className="flex-grow pt-24">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
