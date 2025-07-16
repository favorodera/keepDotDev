import { bundledLanguages, createHighlighter } from 'shiki'
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

let shikiHighlighterInstance: HighlighterGeneric<BundledLanguage, BundledTheme> | undefined

export default defineNuxtPlugin(async () => {
  
  if (!shikiHighlighterInstance) {
    shikiHighlighterInstance = await createHighlighter({
      langs: Object.keys(bundledLanguages),
      themes: ['ayu-dark'],
    })
  }

  return {
    provide: {
      shikiHighlighter: shikiHighlighterInstance,
    },
  }
})
