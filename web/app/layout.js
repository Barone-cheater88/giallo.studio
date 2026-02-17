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
      // Assicura che l'URL sia assoluto
      // Sanity CDN può restituire URL che iniziano con // o https://
      let absoluteUrl = url
      if (url.startsWith('//')) {
        absoluteUrl = `https:${url}`
      } else if (!url.startsWith('http')) {
        absoluteUrl = `https://${url}`
      }
      
      let format = 'woff2'
      if (ext === 'woff') format = 'woff'
      else if (ext === 'woff2') format = 'woff2'
      else if (ext === 'ttf') format = 'truetype'
      else if (ext === 'otf') format = 'opentype'
      else if (ext === 'eot') format = 'embedded-opentype'
      
      // EOT richiede formato speciale
      if (ext === 'eot') {
        srcDeclarations.push(`url('${absoluteUrl}')`)
        srcDeclarations.push(`url('${absoluteUrl}?#iefix') format('embedded-opentype')`)
      } else {
        srcDeclarations.push(`url('${absoluteUrl}') format('${format}')`)
      }
    })
    
    // Fallback per retrocompatibilità: usa fontFile se fontFiles è vuoto
    if (srcDeclarations.length === 0 && font.fontFile?.asset?.url) {
      const fontUrl = font.fontFile.asset.url
      // Sanity CDN può restituire URL che iniziano con // o https://
      let absoluteUrl = fontUrl
      if (fontUrl.startsWith('//')) {
        absoluteUrl = `https:${fontUrl}`
      } else if (!fontUrl.startsWith('http')) {
        absoluteUrl = `https://${fontUrl}`
      }
      const fileExtension = fontUrl.split('.').pop()?.toLowerCase()
      let format = 'woff2'
      
      if (fileExtension === 'woff') format = 'woff'
      else if (fileExtension === 'woff2') format = 'woff2'
      else if (fileExtension === 'ttf') format = 'truetype'
      else if (fileExtension === 'otf') format = 'opentype'
      
      srcDeclarations.push(`url('${absoluteUrl}') format('${format}')`)
    }
    
    if (srcDeclarations.length === 0) return null
    
    // Prendi il primo file (woff2 se disponibile) per il preload
    const firstFile = sortedFiles.length > 0 ? sortedFiles[0].url : (font.fontFile?.asset?.url)
    
    return `
      @font-face {
        font-family: "${fontFamily}";
        src: ${srcDeclarations.join(', ')};
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        font-display: swap;
        /* Fix per Safari: assicura che il font venga caricato correttamente */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* Fix per Chrome/Firefox: assicura che i font vengano caricati correttamente */
        font-feature-settings: normal;
        font-variant: normal;
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

  // Genera link di preload per i font (solo woff2 per performance)
  const fontPreloads = settings?.customFonts
    ?.filter(font => {
      // Usa fontFiles se disponibili, altrimenti fontFile per retrocompatibilità
      return (font.fontFiles && font.fontFiles.length > 0) || font.fontFile?.asset?.url
    })
    .map(font => {
      // Trova il file woff2 o il primo file disponibile
      let firstFile = null
      if (font.fontFiles && font.fontFiles.length > 0) {
        const woff2File = font.fontFiles.find(file => 
          file?.asset?.url?.toLowerCase().endsWith('.woff2')
        )
        firstFile = woff2File || font.fontFiles[0]
      } else if (font.fontFile?.asset?.url) {
        firstFile = font.fontFile
      }
      
      if (!firstFile?.asset?.url) return null
      
      const url = firstFile.asset.url
      // Assicura che l'URL sia assoluto
      // Sanity CDN può restituire URL che iniziano con // o https://
      let absoluteUrl = url
      if (url.startsWith('//')) {
        absoluteUrl = `https:${url}`
      } else if (!url.startsWith('http')) {
        absoluteUrl = `https://${url}`
      }
      const ext = url.split('.').pop()?.toLowerCase() || ''
      let type = 'font/woff2'
      if (ext === 'woff') type = 'font/woff'
      else if (ext === 'ttf') type = 'font/ttf'
      else if (ext === 'otf') type = 'font/otf'
      
      return (
        <link
          key={`preload-${font.familyName}`}
          rel="preload"
          href={absoluteUrl}
          as="font"
          type={type}
          crossOrigin="anonymous"
        />
      )
    })
    .filter(Boolean)

  return (
    <html lang="it">
      <head>
        {fontPreloads}
        {customFontStyles && (
          <style 
            id="custom-fonts-styles"
            dangerouslySetInnerHTML={{ __html: customFontStyles }} 
          />
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
