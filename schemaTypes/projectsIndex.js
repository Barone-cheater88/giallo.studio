import { defineType, defineField } from 'sanity'

/**
 * Singleton per la pagina indice /projects (SEO + contenuto editoriale).
 * Non è una "page" generica: è dedicata all'archivio progetti.
 */
export const projectsIndex = defineType({
  name: 'projectsIndex',
  title: 'Projects Index',
  type: 'document',
  __experimental_singleton: true,

  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Pagina',
      type: 'string',
      description: 'Titolo della pagina /projects',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Introduzione',
      type: 'text',
      rows: 4,
      description: 'Testo introduttivo mostrato sopra l’elenco dei progetti'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Impostazioni SEO per la pagina /projects',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          options: { hotspot: true }
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url'
        })
      ]
    })
  ],

  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title || 'Projects Index'
      }
    }
  }
})




