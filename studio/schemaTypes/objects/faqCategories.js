import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const faqCategories = defineType({
  name: 'faqCategories',
  type: 'object',
  title: 'Categories',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Heading displayed above the categories section.',
    }),
    defineField({
      name: 'showAllCategories',
      type: 'boolean',
      title: 'Show all categories',
      description: 'Display all categories automatically, or choose specific ones below.',
      options: {layout: 'checkbox'},
      initialValue: true,
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Specific Categories',
      description:
        'Choose which categories to display. Only appears when "Show All Categories" is unchecked.',
      of: [
        {
          type: 'reference',
          to: [{type: 'faqCategory'}],
          options: {
            filter: '!defined(parent)',
          },
        },
      ],
      hidden: ({parent}) => parent?.showAllCategories === true,
      validation: (Rule) => [Rule.unique()],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      showAll: 'showAllCategories',
      categories: 'categories', // Select the entire array instead
    },
    prepare({title, showAll, categories}) {
      const subtitle = showAll ? 'All categories' : `Selected: ${categories?.length ?? 0}`
      return {title: title || 'Categories', subtitle}
    },
  },
})
