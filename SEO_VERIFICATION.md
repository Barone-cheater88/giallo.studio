# Verifica SEO - Stato Attuale

## ✅ Implementato e Funzionante

### 1. Metadata SEO Globali
- **Layout principale** (`web/app/layout.js`): ✅
  - Title dinamico da `siteSettings.seo.metaTitle` o `siteSettings.siteTitle`
  - Description da `siteSettings.seo.metaDescription` o `siteSettings.siteClaim`
  - Keywords da `siteSettings.seo.keywords`
  - Open Graph completo (title, description, images, url)
  - Twitter Cards
  - Canonical URL da `siteSettings.siteUrl`

### 2. Metadata SEO per Pagine
- **Homepage** (`web/app/page.js`): ✅
  - Title da `projectsIndex.seo.metaTitle` o fallback
  - Description da `projectsIndex.seo.metaDescription` o fallback
  - OG Image da `projectsIndex.seo.ogImage` o fallback
  - Canonical URL

- **Pagina Projects** (`web/app/projects/page.js`): ✅
  - Title da `projectsIndex.seo.metaTitle`
  - Description da `projectsIndex.seo.metaDescription`
  - OG Image da `projectsIndex.seo.ogImage`
  - Canonical URL

- **Pagina About** (`web/app/about/page.js`): ✅
  - Title da `pages.seo.metaTitle` (slug: 'about')
  - Description da `pages.seo.metaDescription`
  - OG Image da `pages.seo.ogImage`
  - Canonical URL

- **Pagina Contacts** (`web/app/contacts/page.js`): ✅
  - Title da `pages.seo.metaTitle` (slug: 'contacts')
  - Description da `pages.seo.metaDescription`
  - OG Image da `pages.seo.ogImage`
  - Canonical URL

- **Pagine Progetti Singoli** (`web/app/projects/[slug]/page.js`): ✅ **APPENA AGGIUNTO**
  - Title da `projects.seo.metaTitle` o `projects.title`
  - Description da `projects.seo.metaDescription` o `projects.description`
  - Keywords da `projects.seo.keywords`
  - OG Image da `projects.seo.ogImage` o `projects.coverImage`
  - Canonical URL da `projects.seo.canonicalUrl` o generato automaticamente
  - Twitter Cards

### 3. Immagini Alt Text
- **Gallery progetti**: ✅ Usa `item.image.alt` da Sanity
- **Cover images**: ✅ Campo `alt` recuperato nelle query
- **ProjectPreview**: ⚠️ Usa alt hardcoded "Project preview" (non critico, è un preview hover)

### 4. Sitemap
- ✅ Sitemap dinamica (`web/app/sitemap.js`)
  - Include homepage
  - Include tutte le pagine da Sanity
  - Include tutti i progetti da Sanity
  - Si aggiorna automaticamente

### 5. Robots.txt
- ✅ Creato (`web/public/robots.txt`)
  - Permette tutti i crawler
  - Punto di riferimento alla sitemap

### 6. Security Headers
- ✅ Implementati in `next.config.mjs`
  - HSTS
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy

## 📋 Come Verificare che Tutto Funzioni

### 1. Verifica Metadata (Dopo Deploy)
Visita queste pagine e controlla il codice sorgente (View Source):

```bash
# Homepage
https://giallo.studio

# Pagina Projects
https://giallo.studio/projects

# Pagina About
https://giallo.studio/about

# Pagina Contacts
https://giallo.studio/contacts

# Progetto singolo (sostituisci SLUG)
https://giallo.studio/projects/SLUG
```

Cerca nei `<head>`:
- `<title>` - deve contenere il title da Sanity
- `<meta name="description">` - deve contenere description da Sanity
- `<meta name="keywords">` - deve contenere keywords da Sanity
- `<meta property="og:title">` - Open Graph title
- `<meta property="og:description">` - Open Graph description
- `<meta property="og:image">` - Open Graph image
- `<link rel="canonical">` - Canonical URL

### 2. Verifica Immagini Alt Text
- Apri una pagina progetto
- Fai click destro su un'immagine → "Ispeziona elemento"
- Verifica che l'attributo `alt` sia presente e descrittivo

### 3. Tool di Verifica Online
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Lighthouse (Chrome DevTools)**: F12 → Lighthouse → SEO

### 4. Verifica Sitemap
Visita: `https://giallo.studio/sitemap.xml`
- Dovrebbe mostrare tutte le pagine e progetti
- Dovrebbe essere in formato XML valido

### 5. Verifica Robots.txt
Visita: `https://giallo.studio/robots.txt`
- Dovrebbe permettere tutti i crawler
- Dovrebbe avere riferimento alla sitemap

## ✅ Pronto per Google Search Console

Tutti i campi SEO da Sanity sono ora implementati e utilizzati:

1. ✅ **metaTitle** - Usato in tutte le pagine
2. ✅ **metaDescription** - Usato in tutte le pagine
3. ✅ **keywords** - Usato in layout globale e progetti
4. ✅ **ogImage** - Usato in tutte le pagine con fallback
5. ✅ **canonicalUrl** - Usato in tutte le pagine con fallback
6. ✅ **alt text immagini** - Usato nelle gallery
7. ✅ **coverImage alt** - Recuperato nelle query

## 🚀 Prossimi Passi

1. **Deploy le modifiche** (già fatto con commit precedente)
2. **Attendi deploy Netlify** (1-2 minuti)
3. **Verifica con tool online** (usando i link sopra)
4. **Configura Google Search Console**
5. **Invia sitemap a Google**: `https://giallo.studio/sitemap.xml`
6. **Configura Google Analytics**
