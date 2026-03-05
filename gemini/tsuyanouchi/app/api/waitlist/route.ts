import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';

const bodySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? 'Invalid email';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { email } = parsed.data;

    const { error } = await supabase.from('waitlist').insert({ email });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the list.' },
          { status: 409 }
        );
      }
      console.error('Waitlist insert error:', error);
      return NextResponse.json(
        { error: 'Could not add you to the waitlist. Please try again.' },
        { status: 500 }
      );
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
