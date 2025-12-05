import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

export const faqSearch = defineType({
  name: 'faqSearch',
  type: 'object',
  title: 'Search',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'placeholder',
      type: 'string',
      title: 'Search Placeholder',
      description: 'Hint text shown inside the search box before users start typing.',
      validation: (Rule) => [Rule.required(), Rule.max(80)],
    }),
    defineField({
      name: 'enableAskAI',
      type: 'boolean',
      title: 'Enable Ask AI',
      description: 'Turn the AI-powered search assistant on or off.',
      options: {layout: 'checkbox'},
      initialValue: true,
    }),
  ],
  preview: {
    select: {subtitle: 'placeholder'},
    prepare({subtitle}) {
      return {
        title: 'Search',
        subtitle: subtitle || 'No placeholder set',
      }
    },
  },
})
