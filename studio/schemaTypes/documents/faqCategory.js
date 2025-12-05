import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const faqCategory = defineType({
  name: 'faqCategory',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'The name of this category as it appears to users.',
      validation: (Rule) => [Rule.required(), Rule.max(60)],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      description:
        'Unique URL path for this category. Auto-generates from title when you click "Generate".',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'parent',
      title: 'Parent category',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      description: 'Create a subcategory by selecting a parent. Leave blank for main categories.',
      options: {
        filter: '!defined(parent)',
      },
      validation: (Rule) =>
        Rule.custom((parent, context) => {
          if (parent && context.document._id === parent._ref) {
            return 'A category cannot be its own parent'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      parent: 'parent',
    },
    prepare({title, subtitle, parent}) {
      const isChild = parent && Object.keys(parent).length > 0
      return {
        title,
        subtitle: subtitle
          ? `/${subtitle} ${isChild ? '(Subcategory)' : ''}`
          : isChild
            ? '(Subcategory)'
            : '',
      }
    },
  },
})
