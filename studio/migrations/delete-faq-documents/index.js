import {defineMigration, del} from 'sanity/migrate'

export default defineMigration({
  title: 'Delete all FAQ documents',
  documentTypes: ['faqArticle', 'faqCategory'],
  migrate: {
    document(doc) {
      // Note: If a document has incoming strong references, it can't be deleted by this script.
      return del(doc._id)
    },
  },
})
