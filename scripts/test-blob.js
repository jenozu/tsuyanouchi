#!/usr/bin/env node

/**
 * Simple Test Script for Vercel Blob Connection
 * 
 * Run: node scripts/test-blob.js
 */

async function testBlob() {
  console.log('🔍 Testing Vercel Blob Connection...\n')
  
  // Check if token is set
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('❌ ERROR: BLOB_READ_WRITE_TOKEN is not set!\n')
    console.log('📝 To fix this:\n')
    console.log('1. Go to: https://vercel.com/dashboard')
    console.log('2. Select your project')
    console.log('3. Go to Storage tab → Create Blob Store')
    console.log('4. Connect it to your project')
    console.log('5. Run: vercel env pull .env.local')
    console.log('6. Restart this script\n')
    process.exit(1)
  }
  
  console.log('✅ BLOB_READ_WRITE_TOKEN is set')
  console.log(`   Token: ${token.substring(0, 20)}...`)
  console.log('')
  
  try {
    // Dynamic import for ESM module
    const { put, list } = await import('@vercel/blob')
    
    // Test 1: List existing blobs
    console.log('📋 Test 1: Listing existing blobs...')
    const { blobs } = await list()
    console.log(`✅ Found ${blobs.length} existing blob(s)`)
    if (blobs.length > 0) {
      console.log('   Latest uploads:')
      blobs.slice(0, 5).forEach(blob => {
        console.log(`   - ${blob.pathname}`)
      })
    }
    console.log('')
    
    // Test 2: Upload a test file
    console.log('📤 Test 2: Uploading a test file...')
    const testContent = Buffer.from('Test from TSUYA NO UCHI - ' + new Date().toISOString())
    const testBlob = await put('test/connection-test.txt', testContent, {
      access: 'public',
      addRandomSuffix: true,
    })
    console.log('✅ Test file uploaded successfully!')
    console.log(`   URL: ${testBlob.url}`)
    console.log('')
    
    console.log('🎉 SUCCESS! Vercel Blob is working correctly.\n')
    console.log('📝 Next steps:')
    console.log('1. Start your dev server: npm run dev')
    console.log('2. Go to: http://localhost:3000/admin')
    console.log('3. Try uploading an image')
    console.log('4. It should return a URL like: https://xxx.blob.vercel-storage.com/...')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📝 Troubleshooting:')
    console.log('1. Make sure @vercel/blob is installed: npm install @vercel/blob')
    console.log('2. Run: vercel env pull .env.local')
    console.log('3. Make sure Blob store is connected in Vercel Dashboard')
    console.log('4. Restart your terminal/shell\n')
    process.exit(1)
  }
}

// Load .env.local if exists
try {
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const [key, ...values] = line.split('=')
      if (key && values.length) {
        let value = values.join('=').trim()
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[key.trim()] = value
      }
    })
  }
} catch (e) {
  // Ignore
}

testBlob()

