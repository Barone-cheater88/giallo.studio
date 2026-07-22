import { sanityClient } from '@/sanity'
import { siteSettingsQuery } from '@/lib/sanity.queries'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const settings = await sanityClient.fetch(siteSettingsQuery)
    const url = settings?.favicon?.asset?.url

    if (!url) {
      return new Response('Favicon not found', { status: 404 })
    }

    const response = await fetch(url, {
      next: { revalidate: 3600, tags: ['sanity'] },
    })

    if (!response.ok) {
      return new Response('Failed to fetch favicon', { status: 502 })
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/gif'

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('[Favicon Proxy] Error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
