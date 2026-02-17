// Proxy route per servire i font da Sanity CDN con CORS abilitato
export async function GET(request, { params }) {
  try {
    // Ricostruisci l'URL del font da Sanity
    const path = params.path.join('/')
    const sanityUrl = `https://cdn.sanity.io/${path}`
    
    // Scarica il font da Sanity (lato server non ci sono problemi CORS)
    const response = await fetch(sanityUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      },
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch font from Sanity: ${response.status} ${response.statusText}`)
      return new Response(`Font not found: ${response.status}`, { 
        status: response.status,
        headers: {
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
      },
    })
  } catch (error) {
    console.error('Error proxying font:', error)
    return new Response(`Internal Server Error: ${error.message}`, { 
      status: 500,
      headers: {
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
