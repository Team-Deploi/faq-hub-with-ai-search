import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon, SearchIcon, StarIcon, TagIcon} from '@sanity/icons'

export const faqCategoryPage = defineType({
  name: 'faqCategoryPage',
  title: 'Category page',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'Main heading displayed at the top of the category page.',
      // validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: 'subheading',
      type: 'string',
      description: 'Optional supporting text shown below the main heading.',
    }),
    defineField({
      name: 'sections',
      type: 'array',
      description: 'Build your category page by adding and arranging content blocks.',
      options: {sortable: true},
      of: [
        defineArrayMember({type: 'faqSearch', icon: SearchIcon}),
        defineArrayMember({type: 'faqFeaturedSection', icon: StarIcon}),
        defineArrayMember({type: 'faqSubCategories', icon: TagIcon}),
        defineArrayMember({type: 'faqCommonQuestions', icon: HelpCircleIcon}),
      ],
      validation: (Rule) =>
        Rule.custom((blocks = []) => {
          const faqSearchCount = blocks.filter((block) => block._type === 'faqSearch').length
          const faqSubCategoriesCount = blocks.filter(
            (block) => block._type === 'faqSubCategories',
          ).length

          if (faqSearchCount > 1) {
            return 'Only one Search block is allowed per page.'
          }
          if (faqSubCategoriesCount > 1) {
            return 'Only one Subcategories block is allowed per page.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Category page',
      }
    },
  },
})
