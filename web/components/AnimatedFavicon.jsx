'use client'

import { useEffect } from 'react'

const FAVICON_SIZE = 64
const FAVICON_PROXY_URL = '/api/favicon'

function isGifUrl(url) {
  return /\.gif($|\?)/i.test(url)
}

function supportsNativeAnimatedFavicon() {
  return /firefox/i.test(navigator.userAgent)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getAnimatedIconLink() {
  let link = document.querySelector("link[rel='icon'][data-animated-favicon='true']")

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.setAttribute('data-animated-favicon', 'true')
    document.head.appendChild(link)
  }

  return link
}

function removeStaticIconLinks(animatedLink) {
  document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach((link) => {
    if (link !== animatedLink) {
      link.remove()
    }
  })
}

export default function AnimatedFavicon({ url }) {
  useEffect(() => {
    if (!url || !isGifUrl(url) || supportsNativeAnimatedFavicon() || prefersReducedMotion()) {
      return undefined
    }

    let cancelled = false
    let timeoutId = null

    async function startAnimation() {
      const { parseGIF, decompressFrames } = await import('gifuct-js')
      const response = await fetch(FAVICON_PROXY_URL)

      if (!response.ok || cancelled) return

      const buffer = await response.arrayBuffer()
      const gif = parseGIF(buffer)
      const frames = decompressFrames(gif, true)

      if (!frames.length || cancelled) return

      const compositeCanvas = document.createElement('canvas')
      compositeCanvas.width = gif.lsd.width
      compositeCanvas.height = gif.lsd.height
      const compositeCtx = compositeCanvas.getContext('2d')

      const patchCanvas = document.createElement('canvas')
      const patchCtx = patchCanvas.getContext('2d')

      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = FAVICON_SIZE
      outputCanvas.height = FAVICON_SIZE
      const outputCtx = outputCanvas.getContext('2d')

      const iconLink = getAnimatedIconLink()
      removeStaticIconLinks(iconLink)
      let frameIndex = 0
      let frameImageData = null

      const drawPatch = (frame) => {
        const { dims } = frame

        if (
          !frameImageData ||
          dims.width !== frameImageData.width ||
          dims.height !== frameImageData.height
        ) {
          patchCanvas.width = dims.width
          patchCanvas.height = dims.height
          frameImageData = patchCtx.createImageData(dims.width, dims.height)
        }

        frameImageData.data.set(frame.patch)
        patchCtx.putImageData(frameImageData, 0, 0)
        compositeCtx.drawImage(patchCanvas, dims.left, dims.top)
      }

      const updateFavicon = () => {
        outputCtx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE)
        outputCtx.drawImage(
          compositeCanvas,
          0,
          0,
          compositeCanvas.width,
          compositeCanvas.height,
          0,
          0,
          FAVICON_SIZE,
          FAVICON_SIZE
        )

        const dataUrl = outputCanvas.toDataURL('image/png')
        const existingLink = document.querySelector("link[rel='icon'][data-animated-favicon='true']")
        if (existingLink) {
          existingLink.remove()
        }

        const nextLink = document.createElement('link')
        nextLink.rel = 'icon'
        nextLink.type = 'image/png'
        nextLink.setAttribute('data-animated-favicon', 'true')
        nextLink.href = dataUrl
        document.head.appendChild(nextLink)
      }

      const renderFrame = () => {
        if (cancelled) return

        const frame = frames[frameIndex]
        const start = performance.now()

        if (frame.disposalType === 2) {
          compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height)
        }

        drawPatch(frame)
        updateFavicon()

        frameIndex = (frameIndex + 1) % frames.length

        const elapsed = performance.now() - start
        const delay = Math.max(20, frame.delay - elapsed)

        timeoutId = window.setTimeout(renderFrame, delay)
      }

      renderFrame()
    }

    startAnimation().catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Animated favicon failed:', error)
      }
    })

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [url])

  return null
}
