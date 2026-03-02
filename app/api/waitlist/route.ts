import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, source } = (await req.json()) as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    if (!apiKey || !listId) {
      return NextResponse.json(
        { ok: false, error: 'Brevo API credentials not configured' },
        { status: 501 }
      );
    }

    // Add contact to Brevo list
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(listId)],
        updateEnabled: true, // Update if contact already exists
        attributes: {
          SOURCE: source || 'landing',
        },
      }),
    });

    const data = await brevoResponse.json();

    // Brevo returns 201 for new contact, 204 for existing contact updated
    if (brevoResponse.ok || brevoResponse.status === 204) {
      return NextResponse.json({ ok: true, message: 'Successfully added to waitlist' });
    }

    // Handle duplicate email (already in list)
    if (brevoResponse.status === 400 && data.code === 'duplicate_parameter') {
      return NextResponse.json({ ok: true, message: 'Already on the waitlist' });
    }

    return NextResponse.json(
      { ok: false, error: data?.message || 'Failed to add to waitlist' },
      { status: brevoResponse.status }
    );
  } catch (e: any) {
    console.error('Brevo API error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
