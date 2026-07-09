// sanity.js - Client Sanity temporaneo (usando fetch nativo)
// TODO: Sostituire con @sanity/client quando la dipendenza sarà installata

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a5gx9icj'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'

export const sanityClient = {
  fetch: async (query, params = {}) => {
    try {
      // Se query è una funzione (come projectBySlugQuery), chiamala con i params
      let finalQuery = query
      if (typeof query === 'function') {
        finalQuery = query(params.slug || params)
      }

      // Costruiamo l'URL per la API REST di Sanity
      const url = new URL(`https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`)

      // Aggiungiamo la query come parametro
      url.searchParams.set('query', finalQuery)

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json'
        },
        // Dev: sempre fresco. Prod: cache + revalidate via webhook (tag "sanity").
        cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
        next: process.env.NODE_ENV === 'development'
          ? { revalidate: 0 }
          : { revalidate: 60, tags: ['sanity'] }
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error response')
        console.error(`Sanity API error: ${response.status} ${response.statusText}`, errorText)
        return null
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error('Sanity fetch error:', error)
      return null
    }
  }
}
