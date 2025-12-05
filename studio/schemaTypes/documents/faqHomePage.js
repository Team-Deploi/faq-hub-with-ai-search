import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon, HomeIcon, SearchIcon, StarIcon, TagIcon} from '@sanity/icons'

export const faqHomePage = defineType({
  name: 'faqHomePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Main heading displayed at the top of the FAQ home page.',
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'subheading',
      type: 'string',
      description: 'Optional supporting text shown below the main heading.',
    }),
    defineField({
      name: 'sections',
      type: 'array',
      description: 'Build your home page by adding and arranging content blocks.',
      options: {sortable: true},
      of: [
        defineArrayMember({type: 'faqSearch', icon: SearchIcon}),
        defineArrayMember({type: 'faqFeaturedSection', icon: StarIcon}),
        defineArrayMember({type: 'faqCategories', icon: TagIcon}),
        defineArrayMember({type: 'faqCommonQuestions', icon: HelpCircleIcon}),
      ],
      validation: (Rule) =>
        Rule.custom((blocks = []) => {
          const faqSearchCount = blocks.filter((block) => block._type === 'faqSearch').length
          const faqCategoriesCount = blocks.filter(
            (block) => block._type === 'faqCategories',
          ).length

          if (faqSearchCount > 1) {
            return 'Only one Search block is allowed per page.'
          }
          if (faqCategoriesCount > 1) {
            return 'Only one Categories block is allowed per page.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'heading'},
  },
})
