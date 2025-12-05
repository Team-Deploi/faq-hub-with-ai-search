// Define singleton document types
export const SINGLETON_TYPES = ['faqHomePage', 'faqCategoryPage', 'faqChatBot']

// Define content document types
const CONTENT_TYPES = ['faqCategory', 'faqArticle']

// Helper function to create singleton list items
const createSingleton = (S, id, title) =>
  S.listItem()
    .id(id)
    .schemaType(id)
    .title(title)
    .child(S.editor().id(id).schemaType(id).documentId(id))

export const structure = (S) =>
  S.list()
    .title('FAQ Dashboard')
    .items([
      // Pages section
      S.divider().title('Pages'),
      createSingleton(S, 'faqHomePage', 'Home page'),
      createSingleton(S, 'faqCategoryPage', 'Category page'),

      // Content section
      S.divider().title('Content'),
      S.documentTypeListItem('faqArticle').title('Articles'),
      S.documentTypeListItem('faqCategory').title('Category'),

      // Configuration section
      S.divider().title('Configuration'),
      createSingleton(S, 'faqChatBot', 'Chatbot'),

      // System section - all remaining document types
      S.divider().title('System'),
      ...S.documentTypeListItems().filter(
        (listItem) => ![...SINGLETON_TYPES, ...CONTENT_TYPES].includes(listItem.getId()),
      ),
    ])
