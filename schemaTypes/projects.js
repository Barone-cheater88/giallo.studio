import { defineType, defineField } from 'sanity'

export const projects = defineType({
  name: 'projects',
  title: 'Projects',
  type: 'document',

  fields: [
    // === CAMPI BASE ===
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Il titolo del progetto'
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
      description: 'URL slug del progetto (generato automaticamente dal titolo)'
    }),

    defineField({
      name: 'order',
      title: 'Ordinamento',
      type: 'number',
      description: 'Numero per ordinare i progetti (più basso = prima posizione)',
      initialValue: 0
    }),

    defineField({
      name: 'categories',
      title: 'Categorie',
      type: 'array',
      description: 'Seleziona una o più categorie per questo progetto',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Art Direction', value: 'art-direction' },
          { title: 'Brand Identity', value: 'brand-identity' },
          { title: 'Editorial', value: 'editorial' },
          { title: 'Graphic Design', value: 'graphic-design' },
          { title: 'Product Design', value: 'product-design' },
          { title: '3D Modeling', value: '3d-modeling' },
          { title: 'Web Design', value: 'web-design' },
          { title: 'Development', value: 'development' },
          { title: 'Type Design', value: 'type-design' }
        ]
      },
      validation: Rule => Rule.min(1).error('Seleziona almeno una categoria')
    }),

    defineField({
      name: 'coverImage',
      title: 'Immagine di Copertina',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Immagine principale del progetto',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 4,
      description: 'Breve descrizione del progetto'
    }),

    // === INFO SECTION ===
    defineField({
      name: 'info',
      title: 'Info',
      type: 'object',
      description: 'Informazioni dettagliate del progetto',
      fields: [
        // Activity
        defineField({
          name: 'activity',
          title: 'Activity',
          type: 'object',
          description: 'Tipo di attività/progetto',
          fields: [
            defineField({
              name: 'value',
              title: 'Valore',
              type: 'string',
              description: 'Tipo di attività (es: "Web Design", "Branding", "Development")'
            }),
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra questa informazione nel frontend'
            })
          ]
        }),

        // Anno
        defineField({
          name: 'year',
          title: 'Anno',
          type: 'object',
          description: 'Anno di realizzazione',
          fields: [
            defineField({
              name: 'value',
              title: 'Anno',
              type: 'number',
              description: 'Anno di realizzazione del progetto'
            }),
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra questa informazione nel frontend'
            })
          ]
        }),

        // Cliente
        defineField({
          name: 'client',
          title: 'Cliente',
          type: 'object',
          description: 'Informazioni cliente',
          fields: [
            defineField({
              name: 'value',
              title: 'Nome Cliente',
              type: 'string',
              description: 'Nome del cliente'
            }),
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra questa informazione nel frontend'
            })
          ]
        }),

        // Site
        defineField({
          name: 'site',
          title: 'Site',
          type: 'object',
          description: 'Sito web collegato al progetto',
          fields: [
            defineField({
              name: 'name',
              title: 'Nome Sito',
              type: 'string',
              description: 'Nome del sito web'
            }),
            defineField({
              name: 'url',
              title: 'URL Sito',
              type: 'url',
              description: 'URL completa del sito web'
            }),
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra questa informazione nel frontend'
            })
          ]
        }),

        // Crediti
        defineField({
          name: 'credits',
          title: 'Crediti',
          type: 'object',
          description: 'Lista dei crediti/ruoli del progetto',
          fields: [
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra la sezione crediti nel frontend'
            }),
            defineField({
              name: 'items',
              title: 'Lista Crediti',
              type: 'array',
              of: [{
                type: 'object',
                name: 'credit',
                title: 'Credito',
                fields: [
                  defineField({
                    name: 'role',
                    title: 'Ruolo',
                    type: 'string',
                    description: 'Tipo di ruolo (es: "Design", "Development", "Photography")'
                  }),
                  defineField({
                    name: 'names',
                    title: 'Nomi',
                    type: 'array',
                    of: [{ type: 'string' }],
                    description: 'Nomi delle persone/aziende per questo ruolo'
                  }),
                  defineField({
                    name: 'visible',
                    title: 'Visibile Frontend',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Mostra questo credito nel frontend'
                  })
                ],
                preview: {
                  select: {
                    title: 'role',
                    names: 'names'
                  },
                  prepare({ title, names }) {
                    return {
                      title: title || 'Ruolo non specificato',
                      subtitle: names ? names.join(', ') : 'Nessun nome'
                    }
                  }
                }
              }]
            })
          ]
        }),

        // Press
        defineField({
          name: 'press',
          title: 'Press',
          type: 'object',
          description: 'Articoli/press relativi al progetto',
          fields: [
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra la sezione press nel frontend'
            }),
            defineField({
              name: 'items',
              title: 'Lista Articoli',
              type: 'array',
              of: [{
                type: 'object',
                name: 'pressItem',
                title: 'Articolo Press',
                fields: [
                  defineField({
                    name: 'title',
                    title: 'Titolo Articolo',
                    type: 'string',
                    description: 'Titolo dell\'articolo'
                  }),
                  defineField({
                    name: 'url',
                    title: 'URL Articolo',
                    type: 'url',
                    description: 'Link all\'articolo'
                  }),
                  defineField({
                    name: 'visible',
                    title: 'Visibile Frontend',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Mostra questo articolo nel frontend'
                  })
                ],
                preview: {
                  select: {
                    title: 'title',
                    url: 'url'
                  },
                  prepare({ title, url }) {
                    return {
                      title: title || 'Articolo senza titolo',
                      subtitle: url ? new URL(url).hostname : 'Nessun URL'
                    }
                  }
                }
              }]
            })
          ]
        }),

        // Font in Use
        defineField({
          name: 'fontInUse',
          title: 'Font in Use',
          type: 'object',
          description: 'Font utilizzati nel progetto',
          fields: [
            defineField({
              name: 'visible',
              title: 'Visibile Frontend',
              type: 'boolean',
              initialValue: true,
              description: 'Mostra la sezione font in use nel frontend'
            }),
            defineField({
              name: 'items',
              title: 'Lista Font',
              type: 'array',
              of: [{
                type: 'object',
                name: 'fontItem',
                title: 'Font',
                fields: [
                  defineField({
                    name: 'value',
                    title: 'Nome Font',
                    type: 'string',
                    description: 'Nome del font utilizzato nel progetto'
                  }),
                  defineField({
                    name: 'visible',
                    title: 'Visibile Frontend',
                    type: 'boolean',
                    initialValue: true,
                    description: 'Mostra questo font nel frontend'
                  })
                ],
                preview: {
                  select: {
                    title: 'value'
                  },
                  prepare({ title }) {
                    return {
                      title: title || 'Font senza nome'
                    }
                  }
                }
              }]
            })
          ]
        })
      ]
    }),

    // === GALLERIA MEDIA ===
    defineField({
      name: 'mediaGalleries',
      title: 'Galleria Media',
      type: 'array',
      description: 'Gallerie di immagini e video del progetto',
      of: [{
        type: 'object',
        name: 'gallery',
        title: 'Galleria',
        fields: [
          defineField({
            name: 'title',
            title: 'Titolo Galleria',
            type: 'string',
            description: 'Titolo opzionale per la galleria'
          }),

          defineField({
            name: 'columnsDesktop',
            title: 'Numero Colonne Desktop',
            type: 'number',
            description: 'Numero di colonne per la visualizzazione desktop (1-6)',
            options: {
              list: [
                { title: '1 Colonna', value: 1 },
                { title: '2 Colonne', value: 2 },
                { title: '3 Colonne', value: 3 },
                { title: '4 Colonne', value: 4 },
                { title: '5 Colonne', value: 5 },
                { title: '6 Colonne', value: 6 }
              ]
            },
            initialValue: 1,
            validation: Rule => Rule.min(1).max(6)
          }),

          defineField({
            name: 'columnsMobile',
            title: 'Numero Colonne Mobile',
            type: 'number',
            description: 'Numero di colonne per la visualizzazione mobile (1-4)',
            options: {
              list: [
                { title: '1 Colonna', value: 1 },
                { title: '2 Colonne', value: 2 },
                { title: '3 Colonne', value: 3 },
                { title: '4 Colonne', value: 4 }
              ]
            },
            initialValue: 1,
            validation: Rule => Rule.min(1).max(4)
          }),

          defineField({
            name: 'items',
            title: 'Elementi Galleria',
            type: 'array',
            description: 'Immagini e video della galleria',
            of: [
              // Immagine
              {
                type: 'object',
                name: 'galleryImage',
                title: 'Immagine',
                fields: [
                  defineField({
                    name: 'image',
                    title: 'File Immagine',
                    type: 'image',
                    options: {
                      hotspot: true
                    },
                    validation: Rule => Rule.required()
                  }),
                  defineField({
                    name: 'alt',
                    title: 'Testo Alternativo',
                    type: 'string',
                    description: 'Descrizione dell\'immagine per accessibilità',
                    validation: Rule => Rule.required()
                  }),
                  defineField({
                    name: 'caption',
                    title: 'Didascalia',
                    type: 'string',
                    description: 'Didascalia opzionale da mostrare sotto l\'immagine'
                  })
                ],
                preview: {
                  select: {
                    media: 'image',
                    alt: 'alt'
                  },
                  prepare({ media, alt }) {
                    return {
                      title: 'Immagine',
                      subtitle: alt || 'Senza alt text',
                      media: media
                    }
                  }
                }
              },

              // Video
              {
                type: 'object',
                name: 'galleryVideo',
                title: 'Video',
                fields: [
                  defineField({
                    name: 'video',
                    title: 'File Video',
                    type: 'file',
                    options: {
                      accept: 'video/*'
                    },
                    validation: Rule => Rule.required()
                  }),
                  defineField({
                    name: 'poster',
                    title: 'Poster Video',
                    type: 'image',
                    description: 'Immagine di anteprima del video',
                    options: {
                      hotspot: true
                    }
                  }),
                  defineField({
                    name: 'alt',
                    title: 'Testo Alternativo',
                    type: 'string',
                    description: 'Descrizione del video per accessibilità'
                  }),
                  defineField({
                    name: 'caption',
                    title: 'Didascalia',
                    type: 'string',
                    description: 'Didascalia opzionale da mostrare sotto il video'
                  })
                ],
                preview: {
                  select: {
                    media: 'poster',
                    alt: 'alt'
                  },
                  prepare({ media, alt }) {
                    return {
                      title: 'Video',
                      subtitle: alt || 'Senza descrizione',
                      media: media
                    }
                  }
                }
              }
            ],
            validation: Rule => Rule.min(1)
          })
        ],
        preview: {
          select: {
            title: 'title',
            columnsDesktop: 'columnsDesktop',
            columnsMobile: 'columnsMobile',
            items: 'items'
          },
          prepare({ title, columnsDesktop, columnsMobile, items }) {
            const itemCount = items ? items.length : 0
            const columnsText = columnsDesktop && columnsMobile 
              ? `${columnsDesktop}D/${columnsMobile}M`
              : columnsDesktop 
                ? `${columnsDesktop}D`
                : '1'
            return {
              title: title || `Galleria ${columnsText} colonne`,
              subtitle: `${itemCount} elementi`
            }
          }
        }
      }]
    }),

    // === SEO ===
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Impostazioni SEO specifiche del progetto',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titolo SEO personalizzato (max 60 caratteri)'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Descrizione SEO personalizzata (max 160 caratteri)'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Parole chiave specifiche del progetto'
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Immagine personalizzata per social sharing'
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'URL canonica se diverso dallo slug'
        })
      ]
    }),

    // === STATUS ===
    defineField({
      name: 'isPublished',
      title: 'Pubblicato',
      type: 'boolean',
      initialValue: false,
      description: 'Se il progetto è visibile pubblicamente'
    })
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'coverImage',
      order: 'order',
      isPublished: 'isPublished'
    },
    prepare({ title, subtitle, media, order, isPublished }) {
      return {
        title: title || 'Senza titolo',
        subtitle: `${order || 0} • ${subtitle ? `/${subtitle}` : 'no-slug'} ${!isPublished ? '(bozza)' : ''}`,
        media: media
      }
    }
  },

  orderings: [
    {
      title: 'Ordinamento',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Titolo A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Data creazione',
      name: 'createdAtDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    }
  ]
})