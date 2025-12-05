import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const faqFeaturedSection = defineType({
  name: 'faqFeaturedSection',
  title: 'Featured Section',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Heading displayed above this featured section.',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      description: 'Choose and arrange articles to feature. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faqArticle'}]})],
      validation: (Rule) => [Rule.unique()],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      articles: 'articles', // Select the entire array
    },
    prepare({title, articles}) {
      return {
        title: title || 'Featured Section',
        subtitle: `Articles: ${articles?.length ?? 0}`, // Calculate length here
      }
    },
  },
})
