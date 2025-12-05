/* global process */
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {assist} from '@sanity/assist'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES, structure} from './structure'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {media} from 'sanity-plugin-media'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {markdownSchema} from 'sanity-plugin-markdown'
import {embeddingsIndexDashboard} from '@sanity/embeddings-index-ui'
import {createClearSubcategoryPublishAction} from './actions/clearSubcategoryPublishAction'

export default defineConfig({
  name: process.env.SANITY_STUDIO_DATASET,
  title: process.env.SANITY_STUDIO_TITLE,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    media(),
    visionTool(),
    assist(),
    embeddingsIndexDashboard(),
    markdownSchema(),
    unsplashImageAsset(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETON_TYPES.includes(item.templateId)),
    actions: (prev, context) => {
      // Only apply to faqArticle documents
      if (context.schemaType === 'faqArticle') {
        return prev.map((originalAction) =>
          originalAction.action === 'publish'
            ? createClearSubcategoryPublishAction(originalAction)
            : originalAction,
        )
      }
      return prev
    },
  },
})
