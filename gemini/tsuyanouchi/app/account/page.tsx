'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F4]">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-serif text-[#2D2A26] mb-8">Account</h1>
          <div className="bg-white border border-[#E5E0D8] p-8 text-center">
            <p className="text-[#786B59]">Account features coming soon.</p>
            <p className="text-sm text-[#786B59] mt-2">Guest checkout is currently available.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
