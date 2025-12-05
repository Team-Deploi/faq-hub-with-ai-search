import {defineArrayMember, defineField, defineType} from 'sanity'
import {BookIcon, ImageIcon, TagIcon, DocumentTextIcon} from '@sanity/icons'

export const faqArticle = defineType({
  name: 'faqArticle',
  title: 'Article',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'content', title: 'Content', default: true, icon: DocumentTextIcon},
    {name: 'taxonomy', title: 'Taxonomy', icon: TagIcon},
    {name: 'meta', title: 'Meta'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'The main title of your FAQ article as it appears to readers.',
      group: 'content',
      validation: (Rule) => [Rule.required().error()],
    }),
    defineField({
      name: 'breadcrumbTitle',
      type: 'string',
      description: 'Shorter title for navigation breadcrumbs. Uses main title if left empty.',
      group: 'content',
      validation: (Rule) => [Rule.max(80)],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Unique URL path for this article. Click "Generate" to auto-create from title.',
      group: 'content',
      options: {source: 'title'},
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      description: 'Short summary shown in search results and article listings.',
      group: 'content',
      rows: 3,
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'The full article content with formatting, links, and embedded media.',
      type: 'portableText',
      group: 'content',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'media',
      title: 'Screenshots / Media',
      description: 'Add images or screenshots to help explain the article content.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: {
              imageDescriptionField: 'alt',
              imageInstructionField: 'imagePrompt',
            },
          },
          icon: ImageIcon,
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              description: 'Describe what the image shows for screen readers and search engines.',
              validation: (Rule) => [Rule.required()],
            }),
            defineField({
              name: 'imagePrompt',
              type: 'text',
              title: 'Image prompt',
              description: 'Describe the image you want AI to generate.',
              rows: 3,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Choose which main category this article belongs to.',
      group: 'taxonomy',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      options: {
        filter: '_type == "faqCategory" && !defined(parent)', // Only show parent categories
      },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom(async (value, context) => {
          // If there's no subcategory, validation passes
          const subCategory = context.document?.subCategory
          if (!subCategory) {
            return true
          }

          // If category is being removed but subcategory exists
          if (!value && subCategory) {
            return 'Please remove the subcategory before removing the category'
          }

          // Check if the existing subcategory belongs to the new category
          const client = context.getClient({apiVersion: '2024-06-01'})
          const subCategoryDoc = await client.fetch(`*[_id == $subCategoryId][0]{parent}`, {
            subCategoryId: subCategory._ref,
          })

          // Validate parent-child relationship
          if (subCategoryDoc?.parent?._ref !== value._ref) {
            return 'The current subcategory does not belong to this category. Please clear the subcategory first.'
          }

          return true
        }),
      ],
    }),

    defineField({
      name: 'subCategory',
      title: 'Subcategory',
      description: 'Optionally narrow down to a more specific subcategory.',
      group: 'taxonomy',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      hidden: ({document}) => !document?.category,
      options: {
        filter: ({document}) => {
          if (!document?.category?._ref) {
            return {filter: 'false'}
          }
          return {
            filter: 'parent._ref == $parentId',
            params: {parentId: document.category._ref},
          }
        },
      },
    }),
    defineField({
      name: 'volume',
      title: 'Volume',
      description: 'Priority ranking. Higher numbers show first in "Common Questions".',
      group: 'meta',
      type: 'number',
      validation: (Rule) => [Rule.required(), Rule.min(0)],
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      description: 'Suggest other helpful articles readers might want to see next.',
      group: 'meta',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faqArticle'}]})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      subCategoryTitle: 'subCategory.title',
      media: 'media.0',
    },
    prepare({title, categoryTitle, subCategoryTitle, media}) {
      let subtitle = 'FAQ Article'

      if (categoryTitle && subCategoryTitle) {
        subtitle = `${categoryTitle} › ${subCategoryTitle}`
      } else if (categoryTitle) {
        subtitle = categoryTitle
      }

      return {
        title: title || 'Untitled',
        subtitle,
        media,
      }
    },
  },
})
