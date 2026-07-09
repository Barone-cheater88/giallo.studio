const CUSTOM_STRUCTURE_TYPES = ['siteSettings', 'projectsIndex', 'archiviallo', 'pages', 'projects']

const singletonListItem = (S, typeName, title) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .schemaType(typeName)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
        .title(title)
    )

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      singletonListItem(S, 'siteSettings', 'Site Settings'),
      singletonListItem(S, 'projectsIndex', 'Projects Index'),
      singletonListItem(S, 'archiviallo', 'giallo.archive'),
      S.divider(),
      S.documentTypeListItem('pages').title('Pages'),
      S.documentTypeListItem('projects').title('Projects'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !CUSTOM_STRUCTURE_TYPES.includes(listItem.getId())
      )
    ])
