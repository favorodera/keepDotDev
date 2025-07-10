<!-- eslint-disable vue/no-v-html -->
<template>

  <main class="flex flex-col items-start flex-auto w-full gap-4 p-4">

    <div class="flex items-center justify-between w-full">
      <UButton
        icon="lucide:chevron-left"
        variant="link"
        color="neutral"
        size="sm"
        label="Back"
        :ui="{ base: 'p-0' }"
        :to="{ name: 'library-shelf', params: { shelf: routeParams.shelf } }"
      />

    </div>

    <div
      v-if="shelfItem"
      class="flex flex-col flex-auto w-full gap-2"
    >
      <UTabs
        :items="[
          { label: 'Edit', slot: 'edit' as const, icon: 'lucide:code' },
          { label: 'Preview', slot: 'preview' as const, icon: 'lucide:play' },
        ]"
        :ui="{
          root: 'flex-auto',
          content: 'flex-auto flex flex-col relative',
        }"
        size="xs"
        default-value="1"
        :unmount-on-hide="false"
        class="w-full"
      >

        <template #edit>
          <LazyMonacoEditor
            v-model="editorValue"
            lang="markdown"
            :options="{
              theme: 'vs-dark',
              stickyScroll: {
                enabled: false,
              },
              minimap: {
                enabled: false,
              },
              wordWrap: 'on',
              smoothScrolling: true,
              renderLineHighlight: 'none',
              autoDetectHighContrast: false,
              scrollBeyondLastColumn: 0,
              scrollBeyondLastLine: false,
              padding: {
                top: 20,
                bottom: 15,
              },
              overviewRulerLanes: 0,
              scrollbar: {
                horizontal: 'auto',
                vertical: 'hidden',
              },
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              automaticLayout: true,
              lineNumbersMinChars: 4,
              fontSize: 14,
            }"
            class="flex flex-col items-center w-full grow-1"
          >
            <UAlert
              title="Preparing Editor..."
              color="neutral"
              variant="soft"
              icon="lucide:loader-circle"
              class="max-w-md m-auto"
              :ui="{
                icon: 'animate-spin',
              }"
            />
    
          </LazyMonacoEditor>

          <h2 class="lowercase absolute top-1 left-6 text-xs break-all line-clamp-1 overflow-ellipsis text-muted italic">
            {{ shelfItem.name.split(' ').join('-') }}.md
          </h2>
        </template>

        <template #preview>

          <span
            class="prose"
            @click="handleCodeCopy"
            v-html="markdown.render(editorValue)"
          />
        </template>
    
    
      </UTabs>

    </div>

  </main>

</template>

<script lang="ts" setup>
import DOMPurify from 'dompurify'
import markdownIt from 'markdown-it'
import { bundledLanguages, createHighlighter } from 'shiki'
import markdownItAnchor from 'markdown-it-anchor'
import { ref } from 'vue'

const routeParams = useRoute().params
const { getShelfItemById } = shelvesItemsStore()
const shelfItem = ref(getShelfItemById(Number(routeParams.item)))
const editorValue = ref(`## ${shelfItem.value?.name}

> Continue your documentation in markdown`)
const safeHtml = computed(() => DOMPurify.sanitize(editorValue.value || ''))


const shikiHighlighter = await createHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: ['ayu-dark'],
})

const markdown = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (code, language?: string): string => {
    const codeId = `codeblock-${Math.random().toString(36).substring(2, 11)}`
    let langLabel = language || 'plaintext'
    let codeHtml = ''

    try {
      const grammar = language ? shikiHighlighter.getLanguage(language) : null
      codeHtml = shikiHighlighter.codeToHtml(code, { lang: language || 'plaintext', theme: 'ayu-dark' })
      langLabel = grammar ? grammar.name : langLabel
    } catch {
      codeHtml = shikiHighlighter.codeToHtml(code, { lang: 'plaintext', theme: 'ayu-dark' })
    }

    const codeMatch = codeHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/)
    const codeContent = codeMatch ? codeMatch[1] : code

    return `
      <div class="code-block-container" data-lang="${langLabel}">
        <div class="code-block-header">
          <span class="code-block-lang">${langLabel}</span>
          <button class="code-block-copy" data-code-id="${codeId}" aria-label="Copy code" title="Copy code">Copy</button>
        </div>
        <pre id="${codeId}"><code class="shiki">${codeContent}</code></pre>
      </div>
    `
  },
})
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      symbol: '#',
      placement: 'before',
      class: 'heading-anchor',
      space: false,
    }),
    slugify: string => string.trim().toLowerCase().replace(/[^\w]+/g, '-'),
  })

markdown.renderer.rules.fence = (tokens, index, options) => {
  const token = tokens[index]
  if (!token) return ''
  const code = token.content
  const language = (token.info ? token.info.trim().split(/\s+/g)[0] : '') || 'plaintext'
  return options.highlight ? options.highlight(code, language, '') : ''
}

onUnmounted(() => {
  shikiHighlighter.dispose()
})

function handleCodeCopy(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.classList.contains('code-block-copy')) {
    const codeId = target.getAttribute('data-code-id')
    if (codeId) {
      const codeEl = document.getElementById(codeId)
      if (codeEl) {
        const text = codeEl.innerText
        navigator.clipboard.writeText(text).then(() => {
          target.innerText = 'Copied!'
          target.setAttribute('disabled', 'true')
          setTimeout(() => {
            target.innerText = 'Copy'
            target.removeAttribute('disabled')
          }, 1500)
        })
      }
    }
  }
}
</script>

<style scoped>
:deep(.monaco-editor) {
  transition: inherit !important;
}

:deep(.prose) {
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 100%;
  word-break: break-word;
  padding: 1rem;
  flex: auto;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.2;
  position: relative;
  scroll-margin-top: 80px;
  padding-left: 1.2em;
  letter-spacing: -0.01em;
}

:deep(.prose h1) { font-size: 2rem; }
:deep(.prose h2) { font-size: 1.5rem; }
:deep(.prose h3) { font-size: 1.25rem; }
:deep(.prose h4) { font-size: 1.1rem; }
:deep(.prose h5) { font-size: 1rem; }
:deep(.prose h6) { font-size: 0.95rem; }

@media (max-width: 640px) {
  :deep(.prose h1) { font-size: 1.4rem; }
  :deep(.prose h2) { font-size: 1.2rem; }
  :deep(.prose h3) { font-size: 1.1rem; }
}

:deep(.prose .heading-anchor) {
  position: absolute;
  left: 0;
  top: 0;
  color: #888;
  text-decoration: none;
  opacity: 0.7;
  font-size: 1em;
  transition: opacity 0.2s;
  cursor: pointer;
  padding-right: 0.3em;
}
:deep(.prose .heading-anchor:hover) {
  opacity: 1;
  color: #fff;
}

:deep(.prose p) {
  margin: 0.7em 0;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 0.7em 0 0.7em 1.5em;
  padding-left: 1.2em;
}

:deep(.prose ul) {
  list-style-type: disc;
}
:deep(.prose ol) {
  list-style-type: decimal;
}

:deep(.prose li) {
  margin: 0.2em 0;
  line-height: 1.6;
  padding-left: 0.2em;
}

:deep(.prose li > ul),
:deep(.prose li > ol) {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

:deep(.prose pre) {
  padding: 0.8em 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 1em 0;
  font-size: 0.97em;
  background: inherit;
}

:deep(.prose code) {
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 0.97em;
  padding: 0.12em 0.35em;
  border-radius: 0.25em;
  background: rgba(80,80,80,0.18);
  color: #f8f8f2;
}

:deep(.prose pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

:deep(.prose blockquote) {
  border-left: 3px solid #7abaff;
  margin: 1em 0;
  padding: 0.5em 1em;
  color: #b3c7e6;
  background: rgba(80,80,80,0.10);
  border-radius: 0.4em;
  font-style: italic;
}

:deep(.prose a) {
  color: #7abaff;
  text-decoration: underline;
  transition: color 0.2s;
  word-break: break-all;
}
:deep(.prose a:hover) {
  color: #fff;
}

:deep(.prose hr) {
  border: none;
  border-top: 1px solid #444;
  margin: 1.5em 0;
}

:deep(.prose table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
  font-size: 0.97em;
}
:deep(.prose th),
:deep(.prose td) {
  border: 1px solid #444;
  padding: 0.4em 0.7em;
}
:deep(.prose th) {
  background: #222;
  color: #fff;
  font-weight: 600;
}

:deep(.prose img) {
  max-width: 100%;
  border-radius: 0.4em;
  margin: 0.5em 0;
  display: block;
}

:deep(.prose strong) {
  font-weight: 600;
  color: #fff;
}

:deep(.prose em) {
  font-style: italic;
  color: #b3c7e6;
}

:deep(.prose del) {
  text-decoration: line-through;
  color: #888;
}

:deep(.code-block-container) {
  margin: 1em 0;
  border-radius: 0.4em;
  background: #18181b;
  border: 1px solid #232324;
  overflow: hidden;
}
:deep(.code-block-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #18181b;
  color: #b0b0b0;
  font-size: 0.8em;
  padding: 0.25em 0.9em 0.18em 0.9em;
  border-bottom: 1px solid #232324;
}
:deep(.code-block-lang) {
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-weight: 500;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  color: #b0b0b0;
}
:deep(.code-block-copy) {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 0.8em;
  padding: 0.1em 0.7em;
  border-radius: 0.25em;
  transition: background 0.2s, color 0.2s;
  outline: none;
}
:deep(.code-block-copy:hover),
:deep(.code-block-copy:focus) {
  background: #232324;
  color: #fff;
}
:deep(.code-block-copy[disabled]) {
  opacity: 0.7;
  cursor: not-allowed;
}
:deep(.code-block-container pre) {
  margin: 0;
  padding: 0.7em 1em;
  background: transparent;
  border: none;
  font-size: 0.93em;
  overflow-x: auto;
  border-radius: 0;
}
:deep(.code-block-container code.shiki) {
  background: none;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  padding: 0;
  border-radius: 0;
}
</style>
