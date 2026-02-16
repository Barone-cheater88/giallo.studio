'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NotFoundContent({ logo, backgroundColor, backgroundColors }) {
  const [logoColor, setLogoColor] = useState('black')

  // Funzione per verificare se il colore richiede testo nero
  const needsBlackText = (color) => {
    if (!color) return false
    const normalized = color.trim().toLowerCase()
    // Colori che richiedono testo nero
    if (normalized === '#ef0000' || normalized === '#f0f0f0') {
      return true
    }
    return false
  }

  useEffect(() => {
    // Controlla il colore di sfondo corrente
    const checkBackgroundColor = () => {
      const currentBg = getComputedStyle(document.body).backgroundColor
      const dynamicBg = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-background')
      const bgColor = dynamicBg || currentBg || backgroundColor
      
      // Se lo sfondo richiede testo nero, il logo deve essere nero, altrimenti bianco
      if (needsBlackText(bgColor)) {
        setLogoColor('black')
      } else {
        setLogoColor('white')
      }
    }

    checkBackgroundColor()

    // Ascolta i cambiamenti dello sfondo
    const observer = new MutationObserver(checkBackgroundColor)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    return () => observer.disconnect()
  }, [backgroundColor, backgroundColors])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-heading, inherit)',
        fontSize: 'var(--font-heading-size-desktop, inherit)',
        fontWeight: 'var(--font-heading-weight, inherit)',
        fontStyle: 'var(--font-heading-style, inherit)',
        textTransform: 'var(--font-heading-transform, normal)',
        lineHeight: 'var(--font-heading-line-height, inherit)',
        color: 'inherit',
        margin: '0 0 0.5rem 0',
        animation: 'bounce 1s ease-in-out infinite'
      }}>
        404
      </h1>

      <p style={{
        fontSize: 'inherit',
        color: 'inherit',
        margin: '0',
        lineHeight: 'var(--font-body-line-height, inherit)'
      }}>
        This page doesn't exist.
      </p>

      <p style={{
        fontSize: 'inherit',
        color: 'inherit',
        margin: '0',
        lineHeight: 'var(--font-body-line-height, inherit)'
      }}>
        Maybe it was never designed, or maybe it's just somewhere else.
      </p>

      <p style={{
        fontSize: 'inherit',
        color: 'inherit',
        margin: '0 0 2rem 0',
        lineHeight: 'var(--font-body-line-height, inherit)'
      }}>
        You can head back to the <Link href="/" style={{ textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '2px' }}>homepage</Link> and start again.
      </p>

      {logo && (
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            filter: logoColor === 'white' ? 'brightness(0) invert(1)' : 'none',
            transition: 'filter 0.3s ease',
            cursor: 'pointer'
          }}>
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
        </Link>
      )}
    </div>
  )
}

