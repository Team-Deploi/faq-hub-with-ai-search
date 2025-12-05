import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqCommonQuestions = defineType({
  name: 'faqCommonQuestions',
  type: 'object',
  title: 'Common Questions',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Heading displayed above the common questions section.',
    }),
    defineField({
      name: 'limit',
      type: 'number',
      title: 'Limit',
      description: 'How many articles to show. Higher volume articles appear first.',
      validation: (Rule) => [Rule.min(1)],
    }),
  ],
  preview: {
    select: {title: 'title', limit: 'limit'},
    prepare({title, limit}) {
      return {title: title || 'Common questions', subtitle: `Limit: ${limit ?? 'not set'}`}
    },
  },
})
