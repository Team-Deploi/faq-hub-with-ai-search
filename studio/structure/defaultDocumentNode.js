import {JsonPreview} from '../presentation/JsonPreview'

export const defaultDocumentNode = (S, {schemaType}) => {
  if (schemaType === 'faqArticle') {
    return S.document().views([S.view.form(), S.view.component(JsonPreview).title('JSON')])
  }
  return S.document().views([S.view.form()])
}
