// sanity.queries.js - Query GROQ centralizzate per il progetto Next.js + Sanity

/**
 * Query per recuperare le impostazioni globali del sito
 * Restituisce il primo (e unico) documento siteSettings
 */
export const siteSettingsQuery = `
  *[_id == "siteSettings"][0]{
    siteTitle,
    siteClaim,
    menuSubtitle[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          href,
          openInNewTab
        }
      }
    },
    footerSection1,
    siteUrl,
    logo{
      asset->{
        _id,
        url,
        metadata
      }
    },
    logoSvg{
      asset->{
        _id,
        url
      }
    },
    titleSvg{
      asset->{
        _id,
        url
      }
    },
    favicon{
      asset->{
        _id,
        url
      }
    },
    customFonts[]{
      familyName,
      fontUrl,
      fontFiles[]{
        asset->{
          _id,
          url
        }
      },
      fontFile{
        asset->{
          _id,
          url
        }
      },
      fontWeight,
      fontStyle
    },
    seo{
      metaTitle,
      metaDescription,
      keywords,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      },
      googleAnalyticsId,
      facebookAppId
    },
    social,
    navigation[]->{
      _id,
      title,
      slug
    },
    footerText,
    contactInfo{
      address,
      piva,
      phone,
      email,
      instagram,
      linkedin
    },
    legal{
      cookiePolicy,
      privacyPolicy
    },
    selectedClients[]{
      name,
      url
    },
    competencies[]{
      main,
      items
    }
  }
`

/**
 * Query per recuperare tutte le pagine pubblicate
 */
export const pagesQuery = `
  *[_type == "pages" && isPublished == true]{
    _id,
    title,
    slug,
    text1,
    text2,
    seo{
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url,
        metadata
      },
      alt,
      hotspot
    },
    description[]{
      ...,
      markDefs[]{
        ...
      }
    },
    "descriptionText": pt::text(description),
    isPublished
  }
`

/**
 * Query per recuperare una singola pagina per slug
 * @param {string} slug - Lo slug della pagina da recuperare
 */
export const pageBySlugQuery = (slug) => `
  *[_type == "pages" && slug.current == "${slug}" && isPublished == true][0]{
    _id,
    title,
    slug,
    text1,
    text2,
    seo{
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url,
        metadata
      },
      alt,
      hotspot
    },
    description[]{
      ...,
      markDefs[]{
        ...
      }
    },
    "descriptionText": pt::text(description),
    isPublished
  }
`

/**
 * Query per recuperare tutti i progetti pubblicati, ordinati per campo order
 */
export const projectsQuery = `
  *[_type == "projects" && isPublished == true]{
    _id,
    title,
    slug,
    order,
    categories,
    coverImage{
      asset->{
        _id,
        url,
        metadata
      },
      alt,
      hotspot
    },
    description,
    info{
      activity{
        value,
        visible
      },
      year{
        value,
        visible
      },
      client{
        value,
        visible
      },
      site{
        name,
        url,
        visible
      },
      credits{
        visible,
        items[]{
          role,
          names[],
          visible
        }
      },
      press{
        visible,
        items[]{
          title,
          url,
          visible
        }
      },
      fontInUse{
        visible,
        items[]{
          value,
          visible
        }
      }
    },
    mediaGalleries[]{
      title,
      columnsDesktop,
      columnsMobile,
      items[]{
        _type,
        // Immagini
        _type == "galleryImage" => {
          image{
            asset->{
              _id,
              url,
              metadata
            },
            hotspot
          },
          alt,
          caption
        },
        // Video
        _type == "galleryVideo" => {
          video{
            asset->{
              _id,
              url
            }
          },
          poster{
            asset->{
              _id,
              url,
              metadata
            },
            alt,
            hotspot
          },
          alt,
          caption
        }
      }
    },
    seo{
      metaTitle,
      metaDescription,
      keywords,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      },
      canonicalUrl
    },
    isPublished
  } | order(order asc, _createdAt desc)
`

/**
 * Query per recuperare un singolo progetto per slug
 * @param {string} slug - Lo slug del progetto da recuperare
 */
export const projectBySlugQuery = (slug) => `
  *[_type == "projects" && slug.current == "${slug}" && isPublished == true][0]{
    _id,
    title,
    slug,
    order,
    categories,
    coverImage{
      asset->{
        _id,
        url,
        metadata
      },
      alt,
      hotspot
    },
    description,
    info{
      activity{
        value,
        visible
      },
      year{
        value,
        visible
      },
      client{
        value,
        visible
      },
      site{
        name,
        url,
        visible
      },
      credits{
        visible,
        items[]{
          role,
          names[],
          visible
        }
      },
      press{
        visible,
        items[]{
          title,
          url,
          visible
        }
      },
      fontInUse{
        visible,
        items[]{
          value,
          visible
        }
      }
    },
    mediaGalleries[]{
      title,
      columnsDesktop,
      columnsMobile,
      items[]{
        _type,
        // Immagini
        _type == "galleryImage" => {
          image{
            asset->{
              _id,
              url,
              metadata
            },
            hotspot
          },
          alt,
          caption
        },
        // Video
        _type == "galleryVideo" => {
          video{
            asset->{
              _id,
              url
            }
          },
          poster{
            asset->{
              _id,
              url,
              metadata
            },
            alt,
            hotspot
          },
          alt,
          caption
        }
      }
    },
    seo{
      metaTitle,
      metaDescription,
      keywords,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      },
      canonicalUrl
    },
    isPublished
  }
`

/**
 * Query per recuperare i progetti da mostrare in homepage
 * Solo progetti pubblicati
 * Ordinati per campo order, poi per data creazione
 */
export const homeProjectsQuery = `
  *[_type == "projects" && isPublished == true]{
    _id,
    title,
    slug,
    order,
    categories,
    coverImage{
      asset->{
        _id,
        url,
        metadata
      },
      alt,
      hotspot
    },
    description,
    info{
      activity{
        value,
        visible
      },
      year{
        value,
        visible
      },
      client{
        value,
        visible
      }
    }
  } | order(order asc, _createdAt desc)
`

/**
 * Singleton: contenuto + SEO della pagina /projects
 */
export const projectsIndexQuery = `
  *[_id == "projectsIndex"][0]{
    _id,
    title,
    description,
    seo{
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      }
    }
  }
`

/**
 * Singleton: contenuto + SEO della pagina /giallo-archive
 */
export const archivialloQuery = `
  *[_type == "archiviallo" && isPublished == true][0]{
    _id,
    title,
    description,
    seo{
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage{
        asset->{
          _id,
          url,
          metadata
        }
      }
    }
  }
`




