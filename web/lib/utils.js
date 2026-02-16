/**
 * Normalizza un URL, sostituendo localhost con il dominio di produzione
 * @param {string} url - L'URL da normalizzare
 * @param {string} baseUrl - L'URL base di produzione (default: https://giallo.studio)
 * @returns {string} - L'URL normalizzato
 */
export function normalizeUrl(url, baseUrl = 'https://giallo.studio') {
  if (!url || typeof url !== 'string') return url
  
  // Se è già un URL relativo (inizia con /), ritorna così com'è
  if (url.startsWith('/')) return url
  
  // Se contiene localhost, sostituiscilo con il dominio di produzione
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Estrai il path dall'URL localhost
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname + urlObj.search + urlObj.hash
      return `${baseUrl}${path}`
    } catch (e) {
      // Se non è un URL valido, prova a sostituire direttamente
      return url
        .replace(/https?:\/\/localhost(:\d+)?/g, baseUrl)
        .replace(/https?:\/\/127\.0\.0\.1(:\d+)?/g, baseUrl)
    }
  }
  
  // Se è un URL assoluto valido, ritorna così com'è
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Altrimenti, assume che sia un path relativo
  return url
}
