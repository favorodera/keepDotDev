import { bundledLanguages, createHighlighter } from 'shiki'

export default defineNuxtPlugin(async () => {

  const shikiHighlighter = await createHighlighter({
    langs: Object.keys(bundledLanguages),
    themes: ['ayu-dark'],
  })

  return {
    provide: {
      shikiHighlighter,
    },
  }

})
