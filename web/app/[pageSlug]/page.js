import { sanityClient } from '@/sanity'
import { pageBySlugQuery, projectBySlugQuery } from '@/lib/sanity.queries'
import { redirect, notFound } from 'next/navigation'

export default async function Page({ params }) {
  // Next 16 può passare `params` come Promise (server components).
  const resolvedParams = await Promise.resolve(params)
  const { pageSlug } = resolvedParams || {}

  // Se qualcuno visita /pages/home, rimandalo alla home pulita /
  if (pageSlug === 'home') {
    redirect('/')
  }

  const page = await sanityClient.fetch(pageBySlugQuery(pageSlug))

  // Se non esiste una pagina con questo slug, prova a vedere se esiste un progetto
  if (!page) {
    const project = await sanityClient.fetch(projectBySlugQuery(pageSlug))

    // Se esiste un progetto con questo slug, reindirizza alla nuova struttura /projects/:slug
    if (project) {
      redirect(`/projects/${pageSlug}`)
    }

    // Altrimenti 404 classico
    notFound()
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{page.title}</h1>
      {page.description && (
        <p style={{ whiteSpace: 'pre-line' }}>{page.description}</p>
      )}
    </main>
  )
}
