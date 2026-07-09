import { permanentRedirect } from 'next/navigation'

export async function generateMetadata() {
  return {
    title: 'giallo.archive',
    alternates: { canonical: 'https://giallo.studio/giallo-archive' }
  }
}

export default async function Archiviallo() {
  permanentRedirect('/giallo-archive')
}
