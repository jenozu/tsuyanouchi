import { NextRequest, NextResponse } from 'next/server'
import { generateProductDescription } from '@/lib/openai'

// POST /api/generate-description - Generate product description using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, keywords } = body
    
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category' },
        { status: 400 }
      )
    }
    
    const description = await generateProductDescription(
      name,
      category,
      keywords || ''
    )
    
    return NextResponse.json({ description })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description. Please ensure OPENAI_API_KEY is set.' },
      { status: 500 }
    )
  }
}

