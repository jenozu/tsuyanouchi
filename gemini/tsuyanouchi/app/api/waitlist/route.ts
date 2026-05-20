import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Email list collection is handled via Shopify Customer API or a dedicated email
// marketing integration (e.g. Klaviyo). For now this endpoint validates the
// submission and returns success so the newsletter form continues to work.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? 'Invalid email';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Waitlist API error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
