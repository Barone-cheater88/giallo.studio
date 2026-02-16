# Checklist SEO - Verifica Campi Sanity

## ✅ Cosa è già implementato

### Metadata SEO
- [x] Layout globale: metadata dinamici da Sanity (title, description, keywords, OG)
- [x] Homepage: generateMetadata con fallback
- [x] Pagina Projects: generateMetadata con SEO da projectsIndex
- [x] Pagina About: generateMetadata con SEO da page
- [x] Pagina Contacts: generateMetadata con SEO da page
- [ ] **PAGINA PROGETTI SINGOLI: MANCA generateMetadata** ⚠️

### Immagini Alt Text
- [x] Gallery immagini progetti: usa `item.alt` da Sanity
- [x] Cover images nelle query: campo `alt` recuperato
- [ ] **ProjectPreview: usa alt hardcoded invece di Sanity** ⚠️
- [ ] **Cover images progetti: verificare se usano alt text** ⚠️

### Open Graph
- [x] Layout globale: OG tags completi
- [x] Pagine dinamiche: OG images da Sanity
- [x] Fallback a siteSettings se non presente

### Keywords
- [x] Keywords recuperate da Sanity
- [x] Incluse nei metadata

### Canonical URLs
- [x] Canonical URLs da Sanity
- [x] Fallback automatico basato su siteUrl

## ⚠️ Problemi da risolvere

1. **Manca generateMetadata per pagine progetti singoli**
   - File: `web/app/projects/[slug]/page.js`
   - Impatto: SEO non ottimizzato per singoli progetti

2. **ProjectPreview usa alt hardcoded**
   - File: `web/components/ProjectPreview.jsx`
   - Dovrebbe usare `project.coverImage.alt` da Sanity

3. **Cover images progetti: verificare uso alt text**
   - Verificare se le cover images usano alt text quando visualizzate

## 📋 Verifica finale

Prima di configurare Google Search Console e Analytics:

1. ✅ Verificare che tutti i metadata siano presenti
2. ✅ Verificare che tutte le immagini abbiano alt text
3. ✅ Testare con tool SEO (es. Lighthouse, SEO checker)
4. ✅ Verificare che la sitemap includa tutte le pagine
5. ✅ Verificare che robots.txt sia corretto
