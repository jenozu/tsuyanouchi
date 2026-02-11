/**
 * Test Script for Vercel Blob Connection
 * 
 * Run this script to verify that Vercel Blob is properly configured.
 * 
 * Usage: 
 * 1. Make sure BLOB_READ_WRITE_TOKEN is set in .env.local
 * 2. Run: npx ts-node scripts/test-blob-connection.ts
 */

import { put, list } from '@vercel/blob'

async function testBlobConnection() {
  console.log('🔍 Testing Vercel Blob Connection...\n')
  
  // Check if token is set
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('❌ ERROR: BLOB_READ_WRITE_TOKEN is not set!')
    console.log('\n📝 Steps to fix:')
    console.log('1. Go to Vercel Dashboard → Your Project → Storage')
    console.log('2. Create a Blob store if you haven\'t already')
    console.log('3. Connect it to your project')
    console.log('4. The token will be automatically added to your environment variables')
    console.log('5. Pull the env vars locally: vercel env pull .env.local')
    process.exit(1)
  }
  
  console.log('✅ BLOB_READ_WRITE_TOKEN is set\n')
  
  try {
    // Test 1: List existing blobs
    console.log('📋 Test 1: Listing existing blobs...')
    const { blobs } = await list()
    console.log(`✅ Found ${blobs.length} existing blob(s)`)
    if (blobs.length > 0) {
      console.log('   Latest blobs:')
      blobs.slice(0, 3).forEach(blob => {
        console.log(`   - ${blob.pathname} (${blob.size} bytes)`)
      })
    }
    console.log('')
    
    // Test 2: Upload a test file
    console.log('📤 Test 2: Uploading a test file...')
    const testContent = 'This is a test file from TSUYA NO UCHI'
    const testBlob = await put('test/test.txt', testContent, {
      access: 'public',
      addRandomSuffix: true,
    })
    console.log('✅ Test file uploaded successfully!')
    console.log(`   URL: ${testBlob.url}`)
    console.log(`   Pathname: ${testBlob.pathname}`)
    console.log('')
    
    console.log('🎉 All tests passed! Vercel Blob is working correctly.')
    console.log('\n📝 Next steps:')
    console.log('1. Deploy your changes to Vercel')
    console.log('2. Test image upload in your admin dashboard at /admin')
    console.log('3. Uploaded images will be stored in Vercel Blob')
    
  } catch (error) {
    console.error('❌ Error testing Vercel Blob:', error)
    console.log('\n📝 Troubleshooting:')
    console.log('1. Make sure you created the Blob store in Vercel Dashboard')
    console.log('2. Make sure it\'s connected to your project')
    console.log('3. Pull the latest env vars: vercel env pull .env.local')
    console.log('4. Restart your dev server after pulling env vars')
    process.exit(1)
  }
}

testBlobConnection()


