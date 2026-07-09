import { defineType, defineField, defineArrayMember } from 'sanity'

export const pages = defineType({
  name: 'pages',
  title: 'Pages',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Titolo Pagina',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Il titolo della pagina'
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required(),
      description: 'URL slug della pagina (generato automaticamente dal titolo)'
    }),

    defineField({
      name: 'coverImage',
      title: 'Immagine di Copertina',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Immagine principale della pagina'
    }),

    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: Rule => Rule.required()
                  }),
                  defineField({
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Apri in nuova scheda',
                    initialValue: false
                  })
                ]
              }
            ]
          }
        })
      ],
      description: 'Breve descrizione della pagina (supporta link e formattazione)'
    }),

    // Home custom text fields
    defineField({
      name: 'text1',
      title: 'Text 1',
      type: 'text',
      rows: 3,
      description: 'Campo testo (es. hero/intro). Per la home usa lo slug "home".'
    }),

    defineField({
      name: 'text2',
      title: 'Text 2',
      type: 'text',
      rows: 3,
      description: 'Secondo campo testo. Per la home usa lo slug "home".'
    }),

    // SEO per pagina (inclusa Home)
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Impostazioni SEO specifiche della pagina',
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
    }),

    defineField({
      name: 'isPublished',
      title: 'Pubblicato',
      type: 'boolean',
      initialValue: false,
      description: 'Se la pagina è visibile pubblicamente'
    })
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'coverImage'
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Senza titolo',
        subtitle: subtitle ? `/${subtitle}` : 'Nessuno slug',
        media: media
      }
    }
  }
})
