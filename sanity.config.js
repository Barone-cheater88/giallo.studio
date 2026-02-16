import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {duplicateProjectAction} from './studio/duplicateProjectAction'

export default defineConfig({
  name: 'default',
  title: 'giallo',

  projectId: 'a5gx9icj',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  document: {
    actions: (prev, context) => {
      // Aggiungiamo "Duplica progetto" solo per i documenti `projects`
      if (context.schemaType === 'projects') {
        return [...prev, duplicateProjectAction]
      }
      return prev
    },
  },

  schema: {
    types: schemaTypes,
  },
})
