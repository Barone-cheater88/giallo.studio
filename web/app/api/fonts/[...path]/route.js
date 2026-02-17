// Proxy route per servire i font da Sanity CDN con CORS abilitato
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    // Ricostruisci l'URL del font da Sanity
    const path = params.path.join('/')
    
    // Verifica che il path sia valido
    if (!path || path.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid path' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
    
    // Costruisci l'URL di Sanity - potrebbe essere files/ o images/
    const sanityUrl = `https://cdn.sanity.io/${path}`
    
    console.log(`[Font Proxy] Fetching font from: ${sanityUrl}`)
    
    // Prova prima senza Referer, poi con Referer se fallisce
    let response = await fetch(sanityUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
      },
      redirect: 'follow',
    })
    
    // Se fallisce, prova con Referer
    if (!response.ok && response.status === 403) {
      console.log(`[Font Proxy] First attempt failed, trying with Referer...`)
      response = await fetch(sanityUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Referer': 'https://giallo.studio/',
        },
        redirect: 'follow',
      })
    }
    
    console.log(`[Font Proxy] Response status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      console.error(`[Font Proxy] Failed to fetch font: ${response.status} ${response.statusText}`, errorText)
      
      return new Response(JSON.stringify({ 
        error: 'Font not found',
        status: response.status,
        url: sanityUrl,
        message: errorText.substring(0, 200)
      }), { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }
    
    // Determina il content-type in base all'estensione
    const ext = path.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    if (ext === 'woff2') contentType = 'font/woff2'
    else if (ext === 'woff') contentType = 'font/woff'
    else if (ext === 'ttf') contentType = 'font/ttf'
    else if (ext === 'otf') contentType = 'font/otf'
    else if (ext === 'eot') contentType = 'application/vnd.ms-fontobject'
    
    // Ottieni il buffer del font
    const buffer = await response.arrayBuffer()
    
    console.log(`[Font Proxy] Successfully fetched font: ${buffer.byteLength} bytes, type: ${contentType}`)
    
    // Restituisci il font con le intestazioni CORS corrette
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'Accept-Encoding',
        'Content-Length': buffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('[Font Proxy] Error proxying font:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

// Gestisci anche le richieste OPTIONS per CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
