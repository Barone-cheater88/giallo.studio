import Link from 'next/link'
import { sanityClient } from '@/sanity'

export default async function CategoryPage({ params }) {
  const { slug } = params
  const projects = await sanityClient.fetch(`
    *[_type == "projects" && "${slug}" in categories[]->slug.current]
  `)

  if (!projects.length) return <h1>Nessun progetto in questa categoria</h1>

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Progetti categoria: {slug}</h1>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            <Link href={`/projects/${project.slug.current}`}>{project.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
