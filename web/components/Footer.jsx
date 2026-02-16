'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer({ contactInfo, legal, logoSvg, logoSvgContent, social }) {
  const currentYear = new Date().getFullYear()
  const logoSvgUrl = logoSvg?.asset?.url
  const email = contactInfo?.email || 'hello@giallo.studio'
  const instagram = contactInfo?.instagram || social?.instagram
  const linkedin = contactInfo?.linkedin || social?.linkedin
  const piva = contactInfo?.piva || 'IT11144480966'

  // Aggiorna il colore dell'SVG quando cambia il colore del sito
  useEffect(() => {
    if (!logoSvgContent) return

    const updateSvgColor = () => {
      const container = document.querySelector('.footerLogoContainer')
      if (!container) return

      const svg = container.querySelector('svg')
      if (!svg) return

      // Ottieni il colore corrente dal body (che viene modificato da Header.jsx)
      const bodyColor = getComputedStyle(document.body).color
      const cssVarColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
      const currentColor = cssVarColor || bodyColor || getComputedStyle(document.body).getPropertyValue('color') || '#000000'

      // Applica il colore direttamente
      container.style.color = currentColor
      container.style.setProperty('color', currentColor, 'important')
      svg.style.color = currentColor
      svg.style.setProperty('color', currentColor, 'important')
      svg.style.fill = 'currentColor'
      svg.style.setProperty('fill', 'currentColor', 'important')

      // Applica direttamente il colore RGB/HEX a tutti gli elementi SVG
      const allElements = svg.querySelectorAll('*')
      allElements.forEach(el => {
        const fill = el.getAttribute('fill')
        const stroke = el.getAttribute('stroke')
        
        // Applica il colore direttamente come valore RGB/HEX invece di currentColor
        if (fill !== 'none' && fill !== null) {
          el.setAttribute('fill', currentColor)
          el.style.fill = currentColor
          el.style.setProperty('fill', currentColor, 'important')
        }
        if (stroke !== 'none' && stroke !== null) {
          el.setAttribute('stroke', currentColor)
          el.style.stroke = currentColor
          el.style.setProperty('stroke', currentColor, 'important')
        }
      })
      
      // Applica anche al tag SVG stesso
      svg.setAttribute('fill', currentColor)
      svg.style.fill = currentColor
    }

    // Aggiorna immediatamente e poi periodicamente
    setTimeout(updateSvgColor, 50)
    setTimeout(updateSvgColor, 200)
    setTimeout(updateSvgColor, 500)

    const observer = new MutationObserver(() => {
      setTimeout(updateSvgColor, 10)
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    const interval = setInterval(updateSvgColor, 200)

    // Ascolta anche i click (potrebbe essere il pulsante Color)
    const handleClick = () => {
      setTimeout(updateSvgColor, 100)
    }
    document.addEventListener('click', handleClick)

    return () => {
      observer.disconnect()
      clearInterval(interval)
      document.removeEventListener('click', handleClick)
    }
  }, [logoSvgContent])

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Layout Desktop: tre colonne con logo al centro */}
        <div className={styles.footerColumns}>
          {/* Prima colonna: Email e Social */}
          <div className={styles.footerColumn}>
            <div className={styles.footerItem}>
              <a href={`mailto:${email}`} className={styles.link}>
                {email}
              </a>
              <br />
              {instagram && (
                <>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Instagram
                  </a>
                  {linkedin && <span> / </span>}
                </>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Seconda colonna: Logo SVG */}
          <div className={styles.footerColumn}>
            <Link href="/" className={styles.logoLink}>
              {logoSvgContent ? (
                <div 
                  className={`${styles.logoContainer} footerLogoContainer`}
                  style={{ 
                    color: 'inherit',
                    fill: 'currentColor'
                  }}
                  dangerouslySetInnerHTML={{ __html: logoSvgContent }}
                />
              ) : logoSvgUrl ? (
                <div className={styles.logoContainer}>
                  <img 
                    src={logoSvgUrl} 
                    alt="Giallo Studio Logo" 
                    style={{ 
                      maxWidth: '80px', 
                      height: 'auto',
                      filter: 'brightness(0) saturate(100%)',
                      opacity: 1
                    }}
                  />
                </div>
              ) : null}
            </Link>
          </div>

          {/* Terza colonna: Copyright e Legal */}
          <div className={styles.footerColumn}>
            <div className={styles.footerItem}>
              {currentYear} © giallo.studio
              <br />
              {legal?.cookiePolicy ? (
                <Link href={legal.cookiePolicy} className={styles.link}>
                  Cookies
                </Link>
              ) : (
                <span>Cookies</span>
              )}
              {legal?.privacyPolicy && (
                <>
                  {' – '}
                  <Link href={legal.privacyPolicy} className={styles.link}>
                    Privacy Policy
                  </Link>
                </>
              )}
              {!legal?.privacyPolicy && <span> – Privacy Policy</span>}
            </div>
          </div>
        </div>

        {/* Layout Mobile: testo unico con accapi */}
        <div className={styles.footerRows}>
          <div className={styles.footerRow}>
            <a href={`mailto:${email}`} className={styles.link}>hello@giallo.studio</a>
            {' / '}
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
            ) : (
              <span>Instagram</span>
            )}
            {' / '}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>Linkedin</a>
            ) : (
              <span>Linkedin</span>
            )}
            <br />
            P.Iva: {piva}
            <br />
            {currentYear} © giallo.studio
            {' / '}
            {legal?.cookiePolicy ? (
              <Link href={legal.cookiePolicy} className={styles.link}>Cookies</Link>
            ) : (
              <span>Cookies</span>
            )}
            {' – '}
            {legal?.privacyPolicy ? (
              <Link href={legal.privacyPolicy} className={styles.link}>Privacy Policy</Link>
            ) : (
              <span>Privacy Policy</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

