import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon, ImageIcon} from '@sanity/icons'

export const portableText = defineType({
  name: 'portableText',
  title: 'Portable Text',
  type: 'array',
  icon: DocumentTextIcon,
  of: [
    defineArrayMember({
      type: 'block',
    }),
    defineArrayMember({
      name: 'image',
      type: 'image',
      icon: ImageIcon,
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          description: 'Describe the image for screen readers and search engines.',
          validation: (Rule) => [Rule.required(), Rule.max(120)],
        }),
        defineField({
          name: 'caption',
          type: 'string',
          description: 'Optional text displayed below the image.',
          validation: (Rule) => [Rule.max(200)],
        }),
        defineField({
          name: 'imagePrompt',
          type: 'text',
          title: 'Image prompt',
          description: 'Describe the image you want AI to generate.',
          rows: 3,
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
          imageInstructionField: 'imagePrompt',
        },
      },
    }),
  ],
})
