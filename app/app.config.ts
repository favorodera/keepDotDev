import { config, XSSPlugin } from 'md-editor-v3'
import LinkAttr from 'markdown-it-link-attributes'
import Anchor from 'markdown-it-anchor'

export default defineAppConfig({
  ui: {
    colors: {
      neutral: 'neutral',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5',
      },
    },
    dropdownMenu: {
      slots: {
        item: 'cursor-pointer',
      },
    },
    navigationMenu: {
      slots: {
        link: 'cursor-pointer',
      },
    },
  },
  mdEditor: config({
    markdownItPlugins(plugins) {
      return [
        ...plugins,
        {
          type: 'xss',
          plugin: XSSPlugin,
          options: {
            extendedWhiteList: {
              img: ['onerror'],
              iframe: [
                'class',
                'width',
                'height',
                'src',
                'title',
                'border',
                'frameborder',
                'framespacing',
                'allow',
                'allowfullscreen',
              ],
            },
          },
        },
        {
          type: 'linkAttr',
          plugin: LinkAttr,
          options: {
            matcher(href: string) {
              return !href.startsWith('#')
            },
            attrs: {
              target: '_blank',
            },
          },
        },
        {
          type: 'anchor',
          plugin: Anchor,
          options: {
            permalink: Anchor.permalink.linkInsideHeader({
              symbol: '#',
              placement: 'before',
              class: 'heading-anchor',
              space: false,
            }),
            slugify: (string: string) => mdHeadingId(string),
          },
        },
      ]
    },
  }),
})
