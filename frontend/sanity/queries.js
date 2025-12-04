import { defineQuery } from "groq";

export const FAQ_HOMEPAGE_QUERY = defineQuery(`*[
  _type == "faqHomePage"
][0]{
  _id,
  heading,
  subheading,
  sections[]{
    _key,
    _type,
    _type == "faqSearch" => {
      _key,
      _type,
      placeholder,
      enableAskAI
    },
    _type == "faqFeaturedSection" => {
      _key,
      _type,
      title,
      "articles": articles[]->{
        _id,
        title,
        excerpt,
        "slug": slug.current,
        volume,
        category->{
          _id,
          title,
          "slug": slug.current
        },
        subCategory->{
          _id,
          title,
          "slug": slug.current,
          parent->{
            _id,
            title,
            "slug": slug.current
          }
        }
      }
    },
    _type == "faqCategories" => {
      _key,
      _type,
      title,
      showAllCategories,
      "categories": select(
        showAllCategories == true => *[
          _type == "faqCategory" && !defined(parent)
        ] | order(title asc){
          _id,
          title,
          "slug": slug.current,
          "subCategoryCount": count(*[
            _type == "faqCategory" && parent._ref == ^._id
          ])
        },
        defined(categories) => categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        []
      )
    },
    _type == "faqCommonQuestions" => {
      _key,
      _type,
      title,
      limit
    }
  }
}`);

export const FAQ_HOMEPAGE_COMMON_ARTICLES_QUERY = defineQuery(`*[
  _type == "faqArticle"
] | order(volume desc, _createdAt desc)[0...$limit]{
  _id,
  title,
  excerpt,
  "slug": slug.current,
  volume,
  category->{
    _id,
    title,
    "slug": slug.current
  }
}`);

export const FAQ_CATEGORY_PAGE_QUERY = defineQuery(`
  *[_type == "faqCategoryPage"][0]{
    _id,
    heading,
    subheading,
    sections[]{
      _key,
      _type,
      _type == "faqSearch" => {
        placeholder,
        enableAskAI
      },
      _type == "faqSubCategories" => {
        title
      },
      _type == "faqCommonQuestions" => {
        title,
        limit
      }
    }
  }
`);

export const FAQ_CATEGORY_QUERY = defineQuery(`
  *[
    _type == "faqCategory" 
    && slug.current == $categorySlug 
    && !defined(parent)
  ][0]{
    _id,
    title,
    "slug": slug.current,
    
    "subcategories": *[
      _type == "faqCategory" 
      && parent._ref == ^._id
    ]{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const FAQ_CATEGORY_ARTICLES_QUERY = defineQuery(`{
  "articles": *[
    _type == "faqArticle" 
    && category._ref == $categoryId
  ] | order(_createdAt desc)[$start...$limit]{
    _id,
    title,
    excerpt,
    "slug": slug.current,
    volume,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    subCategory->{
      _id,
      title,
      "slug": slug.current,
      parent->{
        _id,
        title,
        "slug": slug.current
      }
    }
  },
  "totalCount": count(*[
    _type == "faqArticle" 
    && category._ref == $categoryId
  ])
}`);

export const FAQ_SUBCATEGORY_PAGE_QUERY = defineQuery(`
  *[_type == "faqCategoryPage"][0]{
    _id,
    heading,
    subheading,
    sections[]{
      _key,
      _type,
      _type == "faqSearch" => {
        placeholder,
        enableAskAI
      },
      _type == "faqSubCategories" => {
        title
      },
      _type == "faqCommonQuestions" => {
        title,
        limit
      }
    }
  }
`);

export const FAQ_SUBCATEGORY_QUERY = defineQuery(`
  *[
    _type == "faqCategory" 
    && slug.current == $subcategorySlug 
    && defined(parent)
  ][0]{
    _id,
    title,
    "slug": slug.current,
    
    "category": parent->{
      _id,
      title,
      "slug": slug.current
    },
    
    "siblings": *[
      _type == "faqCategory" 
      && parent._ref == ^.parent._ref
    ]{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const FAQ_SUBCATEGORY_ARTICLES_QUERY = defineQuery(`{
  "articles": *[
    _type == "faqArticle" 
    && subCategory._ref == $subcategoryId
  ] | order(_createdAt desc)[$start...$limit]{
    _id,
    title,
    excerpt,
    "slug": slug.current,
    volume,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    subCategory->{
      _id,
      title,
      "slug": slug.current,
      parent->{
        _id,
        title,
        "slug": slug.current
      }
    }
  },
  "totalCount": count(*[
    _type == "faqArticle" 
    && subCategory._ref == $subcategoryId
  ])
}`);

export const FAQ_ARTICLE_PATHS_QUERY = defineQuery(`*[
  _type == "faqArticle"
] | order(_id asc)[$start...$end]{
  "slug": slug.current
}`);

export const FAQ_ARTICLE_QUERY =
  defineQuery(`*[_type == "faqArticle" && slug.current == $slug][0]{
  _id,
  title,
  breadcrumbTitle,
  "slug": slug.current,
  excerpt,
  body,
  "plaintextBody": pt::text(body),
  media,
  category->{_id, title, "slug": slug.current},
  subCategory->{_id, title, "slug": slug.current},
  volume,
  relatedArticles[]->{_id, title, "slug": slug.current}
}`);

export const FAQ_ARTICLE_SEARCH_QUERY = defineQuery(`{
  "results": *[
    _type == "faqArticle" &&
    (
      title match $term ||
      excerpt match $term ||
      pt::text(body) match $term
    )
  ]
  | score(
      boost(title match $term, 4),
      boost(excerpt match $term, 2),
      boost(pt::text(body) match $term, 1)
    )
  | order(_score desc, volume desc, _createdAt desc)
  [_score > 0][$start...$end]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category->{
      title,
      "slug": slug.current
    },
    volume,
    _score
  },
  "total": count(*[
    _type == "faqArticle" &&
    (
      title match $term ||
      excerpt match $term ||
      pt::text(body) match $term
    )
  ])
}`);

export const FAQ_LLM_ARTICLES_QUERY = defineQuery(`
  *[_id in $ids]{
    _id,
    title,
    excerpt,
    "body": pt::text(body),
    "slug": slug.current,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    subCategory->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const COMPANY_INFO_QUERY = defineQuery(`
  *[_type == "faqChatBot"][0].companyInformation
`);

export const FAQ_CHATBOT_QUERY = defineQuery(`
  *[_type == "faqChatBot"][0]{
    _id,
    isEnabled,
    chatInstructions,
    dataDescription,
    additionalInstructions,
    companyInformation
  }
`);
