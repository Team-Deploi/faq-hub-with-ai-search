import {defineField, defineType} from 'sanity'
import {RobotIcon} from '@sanity/icons'

export const faqChatBot = defineType({
  name: 'faqChatBot',
  title: 'Chatbot',
  type: 'document',
  icon: RobotIcon,
  fields: [
    defineField({
      name: 'isEnabled', // or 'showChatbot', 'chatbotEnabled', 'isVisible'
      type: 'boolean',
      title: 'Enable Chatbot',
      description: 'Turn the chatbot on or off across your site.',
      options: {
        layout: 'checkbox',
      },
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chatInstructions',
      type: 'markdown',
      description:
        'Core instructions that guide how the chatbot responds. Define the tone, style, and behavior you want.',
    }),
    defineField({
      name: 'dataDescription',
      type: 'markdown',
      description:
        "Explain what data the chatbot can access and how it's structured. Helps the AI understand what information it can reference.",
    }),
    defineField({
      name: 'additionalInstructions',
      type: 'markdown',
      description:
        'Extra guidance for specific scenarios or edge cases. These are added to the main instructions.',
    }),
    defineField({
      name: 'companyInformation',
      type: 'markdown',
      description:
        'Background about your company, products, and services. Helps the chatbot give accurate, on-brand answers.',
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {title: 'Chatbot', subtitle: 'Configuration'}
    },
  },
})
