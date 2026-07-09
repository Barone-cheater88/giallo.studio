import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Singleton dedicato alla pagina /giallo-archive.
 * Rimane separato da `pages` perché ha una route e un layout propri.
 */
export const archiviallo = defineType({
  name: 'archiviallo',
  title: 'giallo.archive',
  type: 'document',
  __experimental_singleton: true,
  initialValue: {
    title: 'giallo.archive',
    isPublished: true
  },

  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Pagina',
      type: 'string',
      description: 'Titolo principale della pagina /giallo-archive',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 4,
      description: 'Testo opzionale mostrato sotto al titolo'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Impostazioni SEO per la pagina /giallo-archive',
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
          of: [defineArrayMember({ type: 'string' })]
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
    }),
    defineField({
      name: 'isPublished',
      title: 'Pubblicato',
      type: 'boolean',
      initialValue: true,
      description: 'Se disattivo, la pagina continua a usare il fallback statico'
    })
  ],

  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title || 'giallo.archive'
      }
    }
  }
})
