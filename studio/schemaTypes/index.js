import {portableText} from './objects/portableText'
import {faqArticle} from './documents/faqArticle'
import {faqCategory} from './documents/faqCategory'
import {faqHomePage} from './documents/faqHomePage'
import {faqCategoryPage} from './documents/faqCategoryPage'
import {faqSearch} from './objects/faqSearch'
import {faqSubCategories} from './objects/faqSubCategories'
import {faqCommonQuestions} from './objects/faqCommonQuestions'
import {faqCategories} from './objects/faqCategories'
import {faqFeaturedSection} from './objects/faqFeaturedSection'
import {faqChatBot} from './documents/faqChatBot'

export const schemaTypes = [
  // objects
  portableText,
  faqSearch,
  faqFeaturedSection,
  faqCategories,
  faqSubCategories,
  faqCommonQuestions,
  // documents
  faqArticle,
  faqCategory,
  faqHomePage,
  faqCategoryPage,
  faqChatBot,
]
