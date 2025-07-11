<!-- eslint-disable vue/no-v-html -->
<template>

  <main class="flex flex-col flex-auto gap-4 items-start p-4 w-full">

    <div class="flex justify-between items-center w-full">
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
      class="flex flex-col flex-auto gap-2 w-full"
    >
      <UTabs
        :items="[
          { label: 'Edit', slot: 'edit' as const, icon: 'lucide:code' },
          { label: 'Preview', slot: 'preview' as const, icon: 'lucide:play' },
        ]"
        :ui="{
          root: 'flex-auto',
          content: 'flex-auto flex flex-col max-h-[82dvh] overflow-auto editor-tab-content-container',
        }"
        size="xs"
        default-value="1"
        :unmount-on-hide="false"
        class="w-full"
      >

        <template #edit>
          <h2
            class="lowercase bg-[#1e1e1e] w-full pl-4 text-xs break-all line-clamp-1 overflow-ellipsis text-muted italic"
          >
            {{ shelfItem.name.split(' ').join('-') }}.md
          </h2>

          <LazyMonacoEditor
            v-model="editorContent"
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
              class="m-auto max-w-md"
              :ui="{
                icon: 'animate-spin',
              }"
            />

          </LazyMonacoEditor>

        </template>

        <template #preview>

          <span
            v-dompurify-html="computedEditorContent"
            class="prose"
            @click="copyCodeBlock"
          />
        </template>


      </UTabs>

    </div>

  </main>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

const routeParams = useRoute().params
const { getShelfItemById } = shelvesItemsStore()
const shelfItem = ref(getShelfItemById(Number(routeParams.item)))

const editorContent = ref(markdownTestContent())

const computedEditorContent = computed(() => markdown.render(editorContent.value))

const { markdown, copyCodeBlock } = handleMarkdown()

</script>

<style scoped lang="css">
  :deep(.monaco-editor) {
    transition: inherit !important;
  }

  :deep(.editor-tab-content-container) {
    scrollbar-width: thin;
    scrollbar-color: var(--ui-border-accented) var(--ui-bg-elevated);
  }

  :deep(.prose) {
    color: var(--ui-text);
    font-size: 1rem;
    line-height: 1.7;
    max-width: 100%;
    word-break: break-word;
    padding: 1rem;
    flex: auto;
    border: 1px solid var(--ui-border);
    border-radius: 1rem;
    background: var(--ui-bg);
  }

  :deep(.prose h1),
  :deep(.prose h2),
  :deep(.prose h3),
  :deep(.prose h4),
  :deep(.prose h5),
  :deep(.prose h6) {
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
    position: relative;
    scroll-margin-top: 5rem;
    padding-left: 1.2rem;
    letter-spacing: -0.01em;
    color: var(--ui-text-highlighted);
  }

  :deep(.prose h1) {
    font-size: 2rem;
  }

  :deep(.prose h2) {
    font-size: 1.5rem;
  }

  :deep(.prose h3) {
    font-size: 1.25rem;
  }

  :deep(.prose h4) {
    font-size: 1.1rem;
  }

  :deep(.prose h5) {
    font-size: 1rem;
  }

  :deep(.prose h6) {
    font-size: 0.95rem;
  }

  @media (max-width: 40rem) {
    :deep(.prose h1) {
      font-size: 1.4rem;
    }

    :deep(.prose h2) {
      font-size: 1.2rem;
    }

    :deep(.prose h3) {
      font-size: 1.1rem;
    }
  }

  :deep(.prose .heading-anchor) {
    position: absolute;
    left: 0;
    top: 0;
    color: var(--ui-text-muted);
    text-decoration: none;
    opacity: 0.7;
    font-size: 1em;
    transition: opacity 0.2s;
    cursor: pointer;
    padding-right: 0.3em;
  }

  :deep(.prose .heading-anchor:hover) {
    opacity: 1;
    color: var(--ui-text-highlighted);
  }

  :deep(.prose p) {
    margin: 0.7rem 0;
  }

  :deep(.prose ul),
  :deep(.prose ol) {
    margin: 0.7rem 0 0.7rem 1.5rem;
    padding-left: 1.2rem;
  }

  :deep(.prose ul) {
    list-style-type: disc;
  }

  :deep(.prose ol) {
    list-style-type: decimal;
  }

  :deep(.prose li) {
    margin: 0.2rem 0;
    line-height: 1.6;
    padding-left: 0.2rem;
  }

  :deep(.prose li > ul),
  :deep(.prose li > ol) {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }

  :deep(.prose pre) {
    padding: 0.8rem 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    font-size: 0.97em;
    background: var(--ui-bg-elevated);
    border: 1px solid var(--ui-border);
  }

  :deep(.prose code) {
    font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: 0.97em;
    padding: 0.12em 0.35em;
    border-radius: 0.25em;
    background: var(--ui-bg-elevated);
    color: var(--ui-primary);
  }

  :deep(.prose pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }

  :deep(.prose blockquote) {
    border-left: 0.2rem solid var(--ui-border-accented);
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    color: var(--ui-text-toned);
    background: var(--ui-bg-elevated);
    border-radius: 0.4rem;
    font-style: italic;
  }

  :deep(.prose a) {
    color: var(--ui-primary);
    text-decoration: underline;
    transition: color 0.2s;
    word-break: break-all;
  }

  :deep(.prose a:hover) {
    color: var(--ui-text-highlighted);
  }

  :deep(.prose hr) {
    border: none;
    border-top: 0.15rem solid var(--ui-border);
    margin: 1.5rem 0;
  }

  :deep(.prose table) {
    border-collapse: collapse;
    margin: 1rem 0;
    width: 100%;
    font-size: 0.97em;
  }

  :deep(.prose th),
  :deep(.prose td) {
    border: 1px solid var(--ui-border);
    padding: 0.4rem 0.7rem;
  }

  :deep(.prose th) {
    background: var(--ui-bg-elevated);
    color: var(--ui-text);
    font-weight: 600;
  }

  :deep(.prose img) {
    max-width: 100%;
    border-radius: 0.4rem;
    margin: 0.5rem 0;
    display: block;
  }

  :deep(.prose strong) {
    font-weight: 600;
    color: var(--ui-text);
  }

  :deep(.prose em) {
    font-style: italic;
    color: var(--ui-info);
  }

  :deep(.prose del) {
    text-decoration: line-through;
    color: var(--ui-text-muted);
  }

  :deep(.code-block-container) {
    margin: 1rem 0;
    border-radius: 0.4rem;
    background: var(--ui-bg-elevated);
    border: 1px solid var(--ui-border);
    overflow: hidden;
  }

  :deep(.code-block-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--ui-bg-elevated);
    color: var(--ui-text-muted);
    font-size: 0.8em;
    padding: 0.25rem 0.9rem 0.18rem 0.9rem;
    border-bottom: 1px solid var(--ui-border);
  }

  :deep(.code-block-lang) {
    font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
    font-weight: 500;
    text-transform: lowercase;
    letter-spacing: 0.02em;
    color: var(--ui-text-muted);
  }

  :deep(.code-block-copy) {
    background: none;
    border: none;
    color: var(--ui-text-muted);
    cursor: pointer;
    font-size: 0.8em;
    padding: 0.1rem 0.7rem;
    border-radius: 0.25em;
    transition: background 0.2s, color 0.2s;
    outline: none;
  }

  :deep(.code-block-copy:hover),
  :deep(.code-block-copy:focus) {
    background: var(--ui-border);
    color: var(--ui-text);
  }

  :deep(.code-block-copy[disabled]) {
    opacity: 0.7;
    cursor: not-allowed;
  }

  :deep(.code-block-container pre) {
    margin: 0;
    padding: 0.7rem 1rem;
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
