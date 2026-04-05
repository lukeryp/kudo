import { NextRequest, NextResponse } from 'next/server'

// Optional Upstash-backed rate limiter — falls back to in-memory map in dev
// In production with Upstash configured, uses sliding window algorithm.

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// In-memory fallback (single-process only — fine for dev / single-server)
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

function inMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = inMemoryStore.get(key)

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, reset: now + windowMs }
  }

  entry.count++
  const remaining = Math.max(0, limit - entry.count)
  return {
    success: entry.count <= limit,
    remaining,
    reset: entry.resetAt,
  }
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // Dynamic import so this module can be loaded without Upstash configured
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  const redis = new Redis({
    url: process.env['UPSTASH_REDIS_REST_URL']!,
    token: process.env['UPSTASH_REDIS_REST_TOKEN']!,
  })

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs / 1000} s`),
  })

  const result = await ratelimit.limit(key)
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  }
}

export async function rateLimit(
  req: NextRequest,
  options: { limit?: number; windowMs?: number } = {},
): Promise<RateLimitResult> {
  const limit = options.limit ?? 60
  const windowMs = options.windowMs ?? 60_000

  // Use IP as key (X-Forwarded-For on Vercel, fallback to remote addr)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'

  const key = `kudo:${req.nextUrl.pathname}:${ip}`

  const hasUpstash =
    !!process.env['UPSTASH_REDIS_REST_URL'] && !!process.env['UPSTASH_REDIS_REST_TOKEN']

  if (hasUpstash) {
    return upstashRateLimit(key, limit, windowMs)
  }

  return inMemoryRateLimit(key, limit, windowMs)
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { data: null, error: 'Too many requests. Please slow down.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.remaining + 1),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
      },
    },
  )
}
