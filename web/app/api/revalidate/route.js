import {revalidateTag} from 'next/cache'

export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json(
      {ok: false, error: 'Missing SANITY_REVALIDATE_SECRET env var'},
      {status: 500}
    )
  }

  const body = await request.json().catch(() => ({}))
  const provided = body?.secret || request.headers.get('x-revalidate-secret')

  if (provided !== secret) {
    return Response.json({ok: false, error: 'Invalid secret'}, {status: 401})
  }

  // Invalidate all Sanity-backed fetches (tagged)
  revalidateTag('sanity')

  return Response.json({ok: true, revalidated: true, tag: 'sanity'})
}




