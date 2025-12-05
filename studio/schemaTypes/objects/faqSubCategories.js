import {defineField, defineType} from 'sanity'

export const faqSubCategories = defineType({
  name: 'faqSubCategories',
  type: 'object',
  title: 'Subcategories',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Heading displayed above the subcategories section.',
    }),
    // defineField({
    //   name: 'showAllSubCategories',
    //   type: 'boolean',
    //   title: 'Show all subcategories',
    //   description: 'Display all subcategories automatically, or choose specific ones below.',
    //   options: {layout: 'checkbox'},
    //   initialValue: true,
    // }),
    // defineField({
    //   name: 'subCategories',
    //   type: 'array',
    //   title: 'Specific Subcategories',
    //   description:
    //     'Choose which subcategories to display. Only appears when "Show All Subcategories" is unchecked.',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [{type: 'faqCategory'}],
    //       options: {
    //         filter: 'defined(parent)',
    //       },
    //     },
    //   ],
    //   hidden: ({parent}) => parent?.showAllSubCategories === true,
    //   validation: (Rule) => [Rule.unique()],
    // }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Subcategories',
      }
    },
  },
})
