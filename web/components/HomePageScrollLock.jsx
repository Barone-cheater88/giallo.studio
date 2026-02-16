'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function HomePageScrollLock() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    if (isHomePage) {
      // Aggiungi classe per identificare la home page
      document.body.classList.add('home-page')
      // Disabilita scroll verticale sulla home
      document.body.style.overflowY = 'hidden'
      document.body.style.height = '100vh'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      // Rimuovi classe e riabilita scroll sulle altre pagine
      document.body.classList.remove('home-page')
      document.body.style.overflowY = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    return () => {
      // Cleanup: rimuovi classe e riabilita scroll quando si esce dal componente
      document.body.classList.remove('home-page')
      document.body.style.overflowY = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isHomePage])

  return null
}

