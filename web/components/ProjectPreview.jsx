'use client'

import { useEffect, useState } from 'react'
import styles from './ProjectPreview.module.css'

export default function ProjectPreview({ imageUrl, isVisible }) {
  const [loaded, setLoaded] = useState(false)
  const [duotoneFilter, setDuotoneFilter] = useState('')

  // Helper per convertire hex/rgb a RGB
  const parseColor = (color) => {
    // Se è già in formato rgb/rgba, estrai i valori
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10)
      }
    }
    
    // Se è hex
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Helper per calcolare la luminosità relativa di un colore RGB
  const getLuminance = (r, g, b) => {
    // Usa la formula standard per la luminosità relativa (stessa usata per grayscale)
    return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
  }

  // Calcola il filtro duotone basato sui colori correnti
  useEffect(() => {
    const updateDuotone = () => {
      // Ottieni i colori correnti dal body
      const bgColor = getComputedStyle(document.body).backgroundColor || 'rgb(0, 0, 0)'
      const textColor = getComputedStyle(document.body).color || 'rgb(255, 255, 255)'
      
      // Converti i colori in RGB
      const bgRgb = parseColor(bgColor) || { r: 0, g: 0, b: 0 }
      const textRgb = parseColor(textColor) || { r: 255, g: 255, b: 255 }
      
      // Calcola la luminosità di entrambi i colori
      const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
      const textLuminance = getLuminance(textRgb.r, textRgb.g, textRgb.b)
      
      // Determina quale colore è più scuro e quale più chiaro
      const isBgDarker = bgLuminance < textLuminance
      const darkColor = isBgDarker ? bgRgb : textRgb
      const lightColor = isBgDarker ? textRgb : bgRgb
      
      // Crea il filtro SVG duotone
      const filterId = 'duotone-preview-filter'
      
      // Calcola i valori normalizzati (0-1) per il duotone
      // Colore scuro va ai toni scuri, colore chiaro ai toni chiari
      const darkR = darkColor.r / 255
      const darkG = darkColor.g / 255
      const darkB = darkColor.b / 255
      const lightR = lightColor.r / 255
      const lightG = lightColor.g / 255
      const lightB = lightColor.b / 255
      
      // Crea una tabella di valori per una transizione fluida nel duotone
      // Toni scuri (0-20%): colore più scuro
      // Toni medi (20-80%): colore intermedio tra scuro e chiaro
      // Toni chiari (80-100%): colore più chiaro
      const createTableValues = (dark, light) => {
        const steps = 20 // Più step per una transizione più fluida
        const values = []
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          let value
          if (t <= 0.20) {
            // Toni scuri: usa solo il colore più scuro
            value = dark
          } else if (t <= 0.80) {
            // Toni medi: interpola tra colore scuro e chiaro
            // Normalizza t da [0.20, 0.80] a [0, 1]
            const normalizedT = (t - 0.20) / (0.80 - 0.20)
            // Interpolazione lineare tra dark e light
            value = dark + (light - dark) * normalizedT
          } else {
            // Toni chiari: usa solo il colore più chiaro
            value = light
          }
          values.push(value)
        }
        return values.join(' ')
      }
      
      const rValues = createTableValues(darkR, lightR)
      const gValues = createTableValues(darkG, lightG)
      const bValues = createTableValues(darkB, lightB)
      
      const svgFilter = `
        <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0; pointer-events: none;">
          <defs>
            <filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <!-- Converti in scala di grigi -->
              <feColorMatrix type="matrix" values="
                0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0.2126 0.7152 0.0722 0 0
                0 0 0 1 0
              "/>
              <!-- Applica il duotone: mappa i toni scuri al colore sfondo e i chiari al colore testo -->
              <feComponentTransfer color-interpolation-filters="sRGB">
                <feFuncR type="table" tableValues="${rValues}"/>
                <feFuncG type="table" tableValues="${gValues}"/>
                <feFuncB type="table" tableValues="${bValues}"/>
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
      `
      
      // Aggiungi o aggiorna il filtro SVG nel documento
      let filterElement = document.getElementById('duotone-svg-filter')
      if (!filterElement) {
        filterElement = document.createElement('div')
        filterElement.id = 'duotone-svg-filter'
        filterElement.style.position = 'absolute'
        filterElement.style.width = '0'
        filterElement.style.height = '0'
        filterElement.style.overflow = 'hidden'
        filterElement.style.pointerEvents = 'none'
        filterElement.style.zIndex = '-1'
        document.body.appendChild(filterElement)
      }
      filterElement.innerHTML = svgFilter
      
      setDuotoneFilter(`url(#${filterId})`)
    }

    updateDuotone()
    
    // Aggiorna quando cambia il colore (osserva i cambiamenti di stile sul body)
    const observer = new MutationObserver(() => {
      updateDuotone()
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    })
    
    // Aggiorna anche quando cambia la dimensione della finestra (per sicurezza)
    window.addEventListener('resize', updateDuotone)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDuotone)
    }
  }, [])

  useEffect(() => {
    if (imageUrl && !loaded) {
      const img = new Image()
      img.onload = () => setLoaded(true)
      img.src = imageUrl
    }
  }, [imageUrl, loaded])

  if (!imageUrl || !isVisible) return null

  return (
    <div className={styles.previewContainer}>
      <img
        src={imageUrl}
        alt="Project preview"
        className={styles.previewImage}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
          filter: duotoneFilter || 'none'
        }}
      />
    </div>
  )
}
