'use client'

import { useEffect, useState } from 'react'

export default function TitleSvg({ svgUrl }) {
  const [svgContent, setSvgContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!svgUrl) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    // Carica l'SVG e sostituisci i colori con currentColor
    fetch(svgUrl)
      .then(res => res.text())
      .then(svg => {
        // Sostituisci fill e stroke con currentColor per permettere il cambio colore
        // Escludi fill="none" e stroke="none" dalla sostituzione
        const modifiedSvg = svg
          .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
          .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
          .replace(/fill='(?!none)[^']*'/g, "fill='currentColor'")
          .replace(/stroke='(?!none)[^']*'/g, "stroke='currentColor'")
        setSvgContent(modifiedSvg)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Error loading SVG:', err)
        setIsLoading(false)
      })
  }, [svgUrl])

  if (isLoading || !svgContent) return null

  return (
    <div
      style={{
        margin: 0,
        marginTop: '100px',
        marginBottom: '80px',
        textAlign: 'center',
        color: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      dangerouslySetInnerHTML={{ 
        __html: svgContent.replace(
          /<svg([^>]*)>/,
          '<svg$1 style="height: 200px; width: auto; max-width: 100%;">'
        )
      }}
    />
  )
}
