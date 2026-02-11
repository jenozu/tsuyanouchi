/**
 * Migration Script: Vercel KV to Supabase
 * 
 * This script migrates product data from Vercel KV to Supabase.
 * 
 * Usage:
 *   npx tsx scripts/migrate-to-supabase.ts
 * 
 * Prerequisites:
 *   - Supabase project created and configured
 *   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 *   - KV_REST_API_URL and KV_REST_API_TOKEN in .env.local
 */

import { kv } from '@vercel/kv'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface KVProduct {
  id: string
  name: string
  description: string
  price: number
  cost?: number
  category: string
  imageUrl: string
  stock: number
  sizes?: Array<{ label: string; price: number }>
  createdAt?: string
  updatedAt?: string
}

async function migrateProducts() {
  console.log('🚀 Starting migration from Vercel KV to Supabase...\n')
  
  try {
    // Step 1: Fetch products from Vercel KV
    console.log('📦 Fetching products from Vercel KV...')
    const kvProducts = await kv.get<KVProduct[]>('products')
    
    if (!kvProducts || kvProducts.length === 0) {
      console.log('⚠️  No products found in Vercel KV')
      return
    }
    
    console.log(`✅ Found ${kvProducts.length} products in KV\n`)
    
    // Step 2: Transform data for Supabase
    console.log('🔄 Transforming data...')
    const supabaseProducts = kvProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      image_url: product.imageUrl, // Map imageUrl to image_url
      stock: product.stock,
      sizes: product.sizes,
    }))
    
    // Step 3: Insert into Supabase
    console.log('📤 Inserting products into Supabase...')
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of supabaseProducts) {
      try {
        const { error } = await supabase
          .from('products')
          .insert(product)
        
        if (error) {
          console.error(`❌ Error inserting "${product.name}":`, error.message)
          errorCount++
        } else {
          console.log(`✅ Migrated: ${product.name}`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Error inserting "${product.name}":`, err)
        errorCount++
      }
    }
    
    // Step 4: Summary
    console.log('\n📊 Migration Summary:')
    console.log(`   Total products in KV: ${kvProducts.length}`)
    console.log(`   Successfully migrated: ${successCount}`)
    console.log(`   Failed: ${errorCount}`)
    
    if (successCount === kvProducts.length) {
      console.log('\n🎉 Migration completed successfully!')
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the logs.')
    }
    
    // Step 5: Verify migration
    console.log('\n🔍 Verifying migration...')
    const { data: supabaseProductsCheck, error } = await supabase
      .from('products')
      .select('id, name')
    
    if (error) {
      console.error('❌ Error verifying migration:', error)
    } else {
      console.log(`✅ Found ${supabaseProductsCheck?.length || 0} products in Supabase`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProducts()
  .then(() => {
    console.log('\n✨ Migration script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error)
    process.exit(1)
  })
