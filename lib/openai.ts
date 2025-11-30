import OpenAI from 'openai'

let openai: OpenAI | null = null

function getClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables')
    }
    openai = new OpenAI({ apiKey })
  }
  return openai
}

export async function generateProductDescription(
  name: string,
  category: string,
  keywords: string
): Promise<string> {
  try {
    const client = getClient()
    
    const prompt = `You are a senior copywriter for "TSUYA NO UCHI", an ultra-luxury Japanese-inspired ukiyo-e art print brand.
Write a compelling, sophisticated, and concise product description (max 40 words) for a product.

Product Name: ${name}
Category: ${category}
Keywords/Vibe: ${keywords}

Tone: Minimalist, poetic, exclusive, high-end, inspired by traditional Japanese aesthetics.
Do not include the product name in the description if possible, focus on the feeling and quality.`

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cheap - perfect for descriptions!
      messages: [
        {
          role: 'system',
          content: 'You are an expert copywriter specializing in luxury Japanese-inspired art and design. You write elegant, concise product descriptions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    })
    
    return completion.choices[0]?.message?.content || 'Could not generate description.'
  } catch (error) {
    console.error('OpenAI Error:', error)
    return 'Error generating description. Please check your API key.'
  }
}

