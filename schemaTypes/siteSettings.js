import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Questo è un documento singolo - ne può esistere solo uno
  __experimental_singleton: true,

  fieldsets: [
    {name: 'branding', title: 'Branding', options: {collapsible: true, collapsed: false}},
    {name: 'seo', title: 'SEO', options: {collapsible: true, collapsed: true}},
    {name: 'navigation', title: 'Navigation', options: {collapsible: true, collapsed: true}},
    {name: 'footer', title: 'Footer', options: {collapsible: true, collapsed: true}},
    {name: 'clients', title: 'Selected Clients', options: {collapsible: true, collapsed: false}},
  ],

  fields: [
    // === IMPOSTAZIONI ESTETICHE ===
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Il titolo principale del sito',
      fieldset: 'branding',
    }),

    defineField({
      name: 'siteClaim',
      title: 'Site Claim',
      type: 'string',
      description: 'Il claim/tagline del sito',
      fieldset: 'branding',
    }),

    defineField({
      name: 'menuSubtitle',
      title: 'Menu Subtitle',
      type: 'array',
      of: [
        {
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
        }
      ],
      description: 'Testo che appare sotto il menu nell\'header (supporta link e formattazione)',
      fieldset: 'branding',
    }),

    defineField({
      name: 'footerSection1',
      title: 'Footer Section 1 Text',
      type: 'text',
      rows: 3,
      description: 'Testo per la prima sezione del footer (supporta andata a capo)',
      fieldset: 'branding',
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Logo principale del sito',
      fieldset: 'branding',
    }),

    defineField({
      name: 'logoSvg',
      title: 'Logo SVG',
      type: 'file',
      options: {
        accept: '.svg'
      },
      description: 'Logo SVG del sito (file .svg)',
      fieldset: 'branding',
    }),

    defineField({
      name: 'titleSvg',
      title: 'Titolo Giallo.Studio SVG',
      type: 'file',
      options: {
        accept: '.svg'
      },
      description: 'SVG del titolo "Giallo.Studio" da mostrare nella home. L\'SVG deve avere fill="currentColor" o stroke="currentColor" per cambiare colore automaticamente.',
      fieldset: 'branding',
    }),

    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Icona del sito (favicon)',
      fieldset: 'branding',
    }),



    defineField({
      name: 'customFonts',
      title: 'Font Personalizzati',
      type: 'array',
      description: 'Carica e configura font personalizzati per il sito',
      fieldset: 'branding',
      of: [{
        type: 'object',
        name: 'customFont',
        title: 'Font Personalizzato',
        fields: [
          defineField({
            name: 'familyName',
            title: 'Nome Famiglia Font',
            type: 'string',
            description: 'Nome della famiglia del font (es: "MyCustomFont")',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'fontUrl',
            title: 'URL Font',
            type: 'url',
            description: 'URL del font da Google Fonts, Adobe Fonts, ecc. (lascia vuoto se carichi il file direttamente)'
          }),
          defineField({
            name: 'fontFiles',
            title: 'File Font (multipli formati)',
            type: 'array',
            description: 'Carica più formati dello stesso font per migliore compatibilità browser. Ordine consigliato: woff2, woff, ttf, eot',
            of: [{
              type: 'file',
              options: {
                accept: '.woff,.woff2,.ttf,.otf,.eot'
              }
            }],
            validation: Rule => Rule.min(1).error('Carica almeno un file font')
          }),
          // Mantieni fontFile per retrocompatibilità
          defineField({
            name: 'fontFile',
            title: 'File Font (singolo - deprecato)',
            type: 'file',
            description: 'DEPRECATO: Usa "File Font (multipli formati)" invece. Mantenuto per retrocompatibilità.',
            options: {
              accept: '.woff,.woff2,.ttf,.otf'
            },
            hidden: true
          }),
          defineField({
            name: 'fontWeight',
            title: 'Peso Font',
            type: 'string',
            options: {
              list: [
                { title: 'Thin (100)', value: '100' },
                { title: 'Extra Light (200)', value: '200' },
                { title: 'Light (300)', value: '300' },
                { title: 'Regular (400)', value: '400' },
                { title: 'Medium (500)', value: '500' },
                { title: 'Semi Bold (600)', value: '600' },
                { title: 'Bold (700)', value: '700' },
                { title: 'Extra Bold (800)', value: '800' },
                { title: 'Black (900)', value: '900' }
              ]
            },
            initialValue: '400'
          }),
          defineField({
            name: 'fontStyle',
            title: 'Stile Font',
            type: 'string',
            options: {
              list: [
                { title: 'Normale', value: 'normal' },
                { title: 'Corsivo', value: 'italic' }
              ]
            },
            initialValue: 'normal'
          })
        ],
        preview: {
          select: {
            title: 'familyName',
            weight: 'fontWeight',
            style: 'fontStyle'
          },
          prepare({ title, weight, style }) {
            return {
              title: title || 'Font senza nome',
              subtitle: `${weight || '400'} ${style || 'normal'}`
            }
          }
        }
      }]
    }),


    // === IMPOSTAZIONI SEO ===
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: 'Impostazioni SEO generali del sito',
      fieldset: 'seo',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titolo predefinito per le pagine (max 60 caratteri)'
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Descrizione predefinita per le pagine (max 160 caratteri)'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Parole chiave principali del sito'
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Immagine predefinita per social sharing'
        }),
        defineField({
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'ID di misurazione Google Analytics (es: G-JQNLFXZ5HS)',
          placeholder: 'G-JQNLFXZ5HS'
        }),
        defineField({
          name: 'facebookAppId',
          title: 'Facebook App ID',
          type: 'string',
          description: 'ID dell\'app Facebook per Open Graph (opzionale)',
          placeholder: '123456789'
        })
      ]
    }),

    // === SOCIAL MEDIA ===
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      description: 'Link ai profili social media',
      fieldset: 'navigation',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'URL del profilo Instagram'
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          description: 'URL del profilo LinkedIn'
        })
      ]
    }),

    // === IMPOSTAZIONI SITO ===
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'URL principale del sito web (es: https://www.miosito.com)',
      fieldset: 'seo',
    }),

    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      description: 'Pagine da includere nel menu di navigazione principale',
      fieldset: 'navigation',
      of: [{
        type: 'reference',
        to: [{ type: 'pages' }],
        options: {
          filter: ({ document }) => {
            // Filtro per mostrare solo le pagine pubblicate
            return {
              filter: 'isPublished == $published',
              params: { published: true }
            }
          }
        }
      }],
      validation: Rule => Rule.unique()
    }),

    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 4,
      description: 'Testo generico da mostrare nel footer del sito',
      fieldset: 'footer',
    }),

    // === INFORMAZIONI DI CONTATTO ===
    defineField({
      name: 'contactInfo',
      title: 'Informazioni di Contatto',
      type: 'object',
      description: 'Informazioni di contatto per la seconda sezione del footer',
      fieldset: 'footer',
      fields: [
        defineField({
          name: 'address',
          title: 'Indirizzo',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'piva',
          title: 'P.IVA',
          type: 'string',
        }),
        defineField({
          name: 'phone',
          title: 'Telefono',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
        }),
      ]
    }),

    // === LEGAL ===
    defineField({
      name: 'legal',
      title: 'Legal',
      type: 'object',
      description: 'Link per Cookie e Privacy Policy',
      fieldset: 'footer',
      fields: [
        defineField({
          name: 'cookiePolicy',
          title: 'Cookie Policy',
          type: 'url',
          description: 'Link alla pagina Cookie Policy'
        }),
        defineField({
          name: 'privacyPolicy',
          title: 'Privacy Policy',
          type: 'url',
          description: 'Link alla pagina Privacy Policy'
        }),
      ]
    }),

    // === SELECTED CLIENTS ===
    defineField({
      name: 'selectedClients',
      title: 'Selected Clients',
      type: 'array',
      description: 'Lista di client selezionati con relativo URL',
      fieldset: 'clients',
      of: [{
        type: 'object',
        name: 'client',
        title: 'Client',
        fields: [
          defineField({
            name: 'name',
            title: 'Nome Client',
            type: 'string',
            description: 'Nome del client',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'url',
            title: 'URL Client',
            type: 'url',
            description: 'URL del sito web del client (opzionale)'
          })
        ],
        preview: {
          select: {
            title: 'name',
            url: 'url'
          },
          prepare({ title, url }) {
            return {
              title: title || 'Client senza nome',
              subtitle: url || 'Nessun URL'
            }
          }
        }
      }]
    }),

    // === COMPETENZE ===
    defineField({
      name: 'competencies',
      title: 'Competenze',
      type: 'array',
      description: 'Lista di competenze con voce principale e sotto-voci',
      fieldset: 'clients',
      of: [{
        type: 'object',
        name: 'competency',
        title: 'Competenza',
        fields: [
          defineField({
            name: 'main',
            title: 'Voce Principale',
            type: 'string',
            description: 'Nome della categoria principale (es: "Creative", "Technical")',
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'items',
            title: 'Sotto-voci',
            type: 'array',
            description: 'Lista delle sotto-voci per questa competenza',
            of: [{ type: 'string' }],
            validation: Rule => Rule.min(1).error('Aggiungi almeno una sotto-voce')
          })
        ],
        preview: {
          select: {
            title: 'main',
            items: 'items'
          },
          prepare({ title, items }) {
            const itemCount = items ? items.length : 0
            return {
              title: title || 'Competenza senza nome',
              subtitle: items && items.length > 0 ? `${items.length} sotto-voci` : 'Nessuna sotto-voce'
            }
          }
        }
      }]
    }),

  ],

  preview: {
    select: {
      title: 'siteTitle',
      media: 'logo'
    },
    prepare({ title, media }) {
      return {
        title: title || 'Site Settings',
        media: media
      }
    }
  }
})

