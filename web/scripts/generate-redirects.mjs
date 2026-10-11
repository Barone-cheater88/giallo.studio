import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a5gx9icj'
const query = `{
  "pages": *[_type == "pages" && defined(slug.current)].slug.current,
  "projects": *[_type == "projects" && defined(slug.current)].slug.current
}`

const url = new URL(`https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/production`)
url.searchParams.set('query', query)

const response = await fetch(url)
if (!response.ok) {
  throw new Error(`Sanity query failed: ${response.status} ${response.statusText}`)
}

const { result } = await response.json()
const pages = new Set(result?.pages || [])
const projects = result?.projects || []

const reserved = new Set([
  'about',
  'contacts',
  'projects',
  'giallo-archive',
  'archiviallo',
  'api',
])

const lines = [
  '# Generato in build. I vecchi URL /slug dei progetti puntano a /projects/slug.',
  '/home / 301',
  '/home/ / 301',
  '/archiviallo /giallo-archive 301',
  '/archiviallo/ /giallo-archive 301',
]

for (const slug of projects) {
  if (!slug || pages.has(slug) || reserved.has(slug)) continue
  lines.push(`/${slug} /projects/${slug} 301`)
  lines.push(`/${slug}/ /projects/${slug} 301`)
}

const redirectsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/_redirects')
await writeFile(redirectsPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${lines.length - 1} redirects to public/_redirects`)
