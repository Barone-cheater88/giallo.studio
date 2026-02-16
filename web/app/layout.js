import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { sanityClient } from "@/sanity";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingLogo from "@/components/FloatingLogo";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import Preloader from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Arial', 'sans-serif'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

export async function generateMetadata() {
  const settings = await sanityClient.fetch(siteSettingsQuery)
  
  const siteTitle = settings?.seo?.metaTitle || settings?.siteTitle || 'giallo.studio'
  const siteDescription = settings?.seo?.metaDescription || settings?.siteClaim || 'Independent creative studio based in Milan.'
  const siteUrl = settings?.siteUrl || 'https://giallo.studio'
  const ogImage = settings?.seo?.ogImage?.asset?.url
  const keywords = settings?.seo?.keywords

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

  // Genera @font-face per i custom fonts e preload links
  const customFontData = settings?.customFonts?.map((font) => {
    if (!font.familyName) return null
    
    const fontFamily = font.familyName
    const fontWeight = font.fontWeight || '400'
    const fontStyle = font.fontStyle || 'normal'
    
    // Se c'è un URL del font (es. Google Fonts)
    if (font.fontUrl) {
      return {
        type: 'import',
        content: `@import url('${font.fontUrl}');`,
        preload: null
      }
    }
    
    // Se c'è un file font caricato
    if (font.fontFile?.asset?.url) {
      const fontUrl = font.fontFile.asset.url
      const fileExtension = fontUrl.split('.').pop()?.toLowerCase()
      let format = 'woff2'
      let mimeType = 'font/woff2'
      
      if (fileExtension === 'woff') {
        format = 'woff'
        mimeType = 'font/woff'
      } else if (fileExtension === 'woff2') {
        format = 'woff2'
        mimeType = 'font/woff2'
      } else if (fileExtension === 'ttf') {
        format = 'truetype'
        mimeType = 'font/ttf'
      } else if (fileExtension === 'otf') {
        format = 'opentype'
        mimeType = 'font/otf'
      }
      
      // Per Safari: se il font è WOFF2, aggiungi anche una versione senza format() come fallback
      let srcDeclaration = `url('${fontUrl}') format('${format}')`
      
      // Se è WOFF2 e Safari potrebbe avere problemi, aggiungi fallback senza format
      if (format === 'woff2') {
        srcDeclaration = `url('${fontUrl}') format('woff2'), url('${fontUrl}')`
      }
      
      return {
        type: 'font-face',
        content: `
          @font-face {
            font-family: '${fontFamily}';
            src: ${srcDeclaration};
            font-weight: ${fontWeight};
            font-style: ${fontStyle};
            font-display: swap;
            /* Fix per Safari e mobile: assicura che il font venga caricato correttamente */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `,
        preload: {
          href: fontUrl,
          as: 'font',
          type: mimeType,
          crossOrigin: 'anonymous'
        }
      }
    }
    
    return null
  }).filter(Boolean)

  const customFontStyles = customFontData
    .map(data => data.content)
    .join('\n')
  
  const fontPreloads = customFontData
    .filter(data => data.preload)
    .map(data => data.preload)


  return (
    <html lang="it">
      <head>
        {/* Preload font files per migliorare il caricamento su mobile */}
        {fontPreloads && fontPreloads.map((preload, index) => (
          <link
            key={index}
            rel="preload"
            href={preload.href}
            as={preload.as}
            type={preload.type}
            crossOrigin={preload.crossOrigin}
          />
        ))}
        {customFontStyles && (
          <style dangerouslySetInnerHTML={{ __html: customFontStyles }} />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          // Le variabili CSS per font vengono impostate da Header.jsx quando si cambia font
          // I colori vengono gestiti da Header.jsx quando si cambia colore
        }}
      >
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
