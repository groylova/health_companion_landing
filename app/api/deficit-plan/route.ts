import { NextResponse } from 'next/server';
import { validate, type CalcInput } from '@/lib/deficit/calc';
import { assemble } from '@/lib/deficit/plan';

// Force the route into Node runtime — module-scoped Map state below relies on
// instance reuse, which Edge runtime invalidates more aggressively.
export const runtime = 'nodejs';

// In-memory token bucket per IP. Module scope = persists across warm
// invocations within a single serverless instance. Limits are best-effort:
// when Vercel spins multiple instances, the effective cap multiplies. That's
// acceptable for stub-stage abuse prevention. Swap to Upstash before wiring a
// real LLM that costs money per call.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

// Periodically prune so the Map can't grow unbounded under attack. Runs lazily
// on each request — no setInterval (would be a memory leak on serverless).
function prune(now: number): void {
  if (buckets.size < 1000) {
    return;
  }
  for (const [ip, b] of buckets) {
    if (now - b.windowStart > RATE_WINDOW_MS * 2) {
      buckets.delete(ip);
    }
  }
}

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff !== null && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  const real = req.headers.get('x-real-ip');
  if (real !== null && real.length > 0) {
    return real;
  }
  return 'unknown';
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  prune(now);
  const existing = buckets.get(ip);
  if (existing === undefined || now - existing.windowStart >= RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return { ok: true, retryAfter: 0 };
  }
  if (existing.count >= RATE_MAX) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - existing.windowStart)) / 1000);
    return { ok: false, retryAfter };
  }
  existing.count += 1;
  return { ok: true, retryAfter: 0 };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const input = body as Partial<CalcInput> & { target?: number };
  const validationError = validate(input);
  if (validationError !== null) {
    return NextResponse.json(
      { error: 'invalid_input', field: validationError.field, reason: validationError.reason },
      { status: 400 },
    );
  }

  const target = typeof input.target === 'number' && input.target > 0 ? input.target : null;
  if (target === null) {
    return NextResponse.json({ error: 'invalid_target' }, { status: 400 });
  }

  const plan = assemble({
    targetKcal: target,
    gender: input.gender as 'male' | 'female',
    activity: input.activity as string,
    goal: input.goal as string,
  });

  if (!plan.fitsBand) {
    return NextResponse.json({ error: 'plan_out_of_band' }, { status: 500 });
  }

  return NextResponse.json({ plan });
}
