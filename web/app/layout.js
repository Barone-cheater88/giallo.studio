import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { sanityClient } from "@/sanity";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingLogo from "@/components/FloatingLogo";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import Preloader from "@/components/Preloader";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = await sanityClient.fetch(siteSettingsQuery)
  
  const siteTitle = settings?.seo?.metaTitle || settings?.siteTitle || 'giallo.studio'
  const siteDescription = settings?.seo?.metaDescription || settings?.siteClaim || 'Independent creative studio based in Milan.'
  const siteUrl = settings?.siteUrl || 'https://giallo.studio'
  const ogImage = settings?.seo?.ogImage?.asset?.url
  const keywords = settings?.seo?.keywords
  const facebookAppId = settings?.seo?.facebookAppId

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`
    },
    description: siteDescription,
    keywords: keywords,
    authors: [{ name: 'giallo.studio' }],
    creator: 'giallo.studio',
    publisher: 'giallo.studio',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: siteUrl,
      siteName: siteTitle,
      title: siteTitle,
      description: siteDescription,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        }
      ] : [],
      ...(facebookAppId && { appId: facebookAppId }),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function RootLayout({ children }) {
  const settings = await sanityClient.fetch(siteSettingsQuery)

  // Carica l'SVG del logo lato server se disponibile
  let logoSvgContent = null
  const logoSvgUrl = settings?.logoSvg?.asset?.url
  if (logoSvgUrl && typeof logoSvgUrl === 'string' && (logoSvgUrl.startsWith('http') || logoSvgUrl.startsWith('https'))) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // Timeout di 5 secondi
      
      const svgResponse = await fetch(logoSvgUrl, {
        cache: 'no-store',
        signal: controller.signal
      }).catch((fetchError) => {
        // Se il fetch fallisce, ritorna null invece di lanciare errore
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error fetching logo SVG:', fetchError.message)
        }
        return null
      })
      
      clearTimeout(timeoutId)
      
      if (svgResponse && svgResponse.ok) {
        const svgText = await svgResponse.text()
        // Sostituisci fill e stroke con currentColor
        logoSvgContent = svgText
          .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
          .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
          .replace(/fill='(?!none)[^']*'/g, "fill='currentColor'")
          .replace(/stroke='(?!none)[^']*'/g, "stroke='currentColor'")
          .replace(
            /<svg([^>]*)>/,
            '<svg$1 style="max-width: 80px; max-height: 80px; width: auto; height: auto; color: inherit; fill: currentColor;">'
          )
      }
    } catch (error) {
      // Gestisci silenziosamente l'errore senza bloccare il rendering
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error loading footer logo SVG:', error.message)
      }
    }
  }

  // Genera @font-face per i custom fonts con supporto multipli formati
  const customFontStyles = settings?.customFonts?.map((font) => {
    if (!font.familyName) return null
    
    const fontFamily = font.familyName
    const fontWeight = font.fontWeight || '400'
    const fontStyle = font.fontStyle || 'normal'
    
    // Se c'è un URL del font (es. Google Fonts)
    if (font.fontUrl) {
      return `@import url('${font.fontUrl}');`
    }
    
    // Supporto per multipli formati (nuovo sistema)
    const fontFiles = font.fontFiles || []
    let srcDeclarations = []
    
    // Ordina i file per priorità: woff2 > woff > ttf > otf > eot
    const formatPriority = { 'woff2': 1, 'woff': 2, 'ttf': 3, 'otf': 4, 'eot': 5 }
    const sortedFiles = fontFiles
      .filter(file => file?.asset?.url)
      .map(file => {
        const url = file.asset.url
        const ext = url.split('.').pop()?.toLowerCase() || ''
        return { url, ext, priority: formatPriority[ext] || 99 }
      })
      .sort((a, b) => a.priority - b.priority)
    
    // Genera src declarations per ogni formato
    sortedFiles.forEach(({ url, ext }) => {
      let format = 'woff2'
      if (ext === 'woff') format = 'woff'
      else if (ext === 'woff2') format = 'woff2'
      else if (ext === 'ttf') format = 'truetype'
      else if (ext === 'otf') format = 'opentype'
      else if (ext === 'eot') format = 'embedded-opentype'
      
      // EOT richiede formato speciale
      if (ext === 'eot') {
        srcDeclarations.push(`url('${url}')`)
        srcDeclarations.push(`url('${url}?#iefix') format('embedded-opentype')`)
      } else {
        srcDeclarations.push(`url('${url}') format('${format}')`)
      }
    })
    
    // Fallback per retrocompatibilità: usa fontFile se fontFiles è vuoto
    if (srcDeclarations.length === 0 && font.fontFile?.asset?.url) {
      const fontUrl = font.fontFile.asset.url
      const fileExtension = fontUrl.split('.').pop()?.toLowerCase()
      let format = 'woff2'
      
      if (fileExtension === 'woff') format = 'woff'
      else if (fileExtension === 'woff2') format = 'woff2'
      else if (fileExtension === 'ttf') format = 'truetype'
      else if (fileExtension === 'otf') format = 'opentype'
      
      srcDeclarations.push(`url('${fontUrl}') format('${format}')`)
    }
    
    if (srcDeclarations.length === 0) return null
    
    return `
      @font-face {
        font-family: '${fontFamily}';
        src: ${srcDeclarations.join(', ')};
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        font-display: swap;
        /* Fix per Safari: assicura che il font venga caricato correttamente */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `
  }).filter(Boolean).join('\n')


  // Structured Data per Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings?.siteTitle || "giallo.studio",
    "url": settings?.siteUrl || "https://giallo.studio",
    "logo": settings?.logo?.asset?.url || settings?.logoSvg?.asset?.url,
    "description": settings?.seo?.metaDescription || settings?.siteClaim || "Independent creative studio based in Milan.",
    ...(settings?.contactInfo?.email && { "email": settings.contactInfo.email }),
    ...(settings?.contactInfo?.address && { "address": {
      "@type": "PostalAddress",
      "addressLocality": settings.contactInfo.address
    }}),
    ...(settings?.social?.instagram && { "sameAs": [settings.social.instagram] }),
  }

  const gaId = settings?.seo?.googleAnalyticsId

  return (
    <html lang="it">
      <head>
        {customFontStyles && (
          <style dangerouslySetInnerHTML={{ __html: customFontStyles }} />
        )}
        <StructuredData data={organizationSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          // Le variabili CSS per font vengono impostate da Header.jsx quando si cambia font
          // I colori vengono gestiti da Header.jsx quando si cambia colore
        }}
      >
        <Analytics gaId={gaId} />
        <Preloader
          logoSvg={settings?.logoSvg}
          logo={settings?.logo}
        />
        <Header
          menuSubtitle={settings?.menuSubtitle || ''}
          logo={settings?.logo}
          logoSvg={settings?.logoSvg}
          logoSvgContent={logoSvgContent}
        />
        <PageTransitionWrapper>
          <div className="siteContainer">
            {children}
          </div>
        </PageTransitionWrapper>
        <Footer 
          contactInfo={settings?.contactInfo}
          legal={settings?.legal}
          logoSvg={settings?.logoSvg}
          logoSvgContent={logoSvgContent}
          social={settings?.social}
        />
      </body>
    </html>
  );
}
