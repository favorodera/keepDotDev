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

      <div class="sticky top-0 flex items-center gap-1 px-2 py-1 rounded-sm bg-elevated w-fit max-w-3xs text-xs">
        <UIcon
          name="codicon:markdown"
          class="shrink-0 text-warning"
        />
        <h2 class="lowercase">
          {{ shelfItem.name.split(' ').join('-') }}.md
        </h2>
      </div>

      <MonacoEditor
        v-if="monaco"
        lang="markdown"
        :model-value="editorValue"
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
            top: 10,
            bottom: 10,
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
        class="w-full grow-1"
      />

    </div>

  </main>

</template>

<script lang="ts" setup>
const monaco = useMonaco()
const hasEditorErrors = ref(false)
const routeParams = useRoute().params
const { getShelfItemById } = shelvesItemsStore()

const shelfItem = computed(() => getShelfItemById(Number(routeParams.item)))

const editorValue = ref(`## ${shelfItem.value?.name}

> Continue your documentation in markdown`)

onMounted(async () => {
  const editor = monaco?.editor
  
  const disposable = editor?.onDidChangeMarkers(() => {
    const markers = editor?.getModelMarkers({})
    hasEditorErrors.value = markers.some(marker =>
      marker.severity === monaco?.MarkerSeverity.Error,
    )
  })

  onBeforeUnmount(() => disposable?.dispose())
})
</script>

<style scoped>
:deep(.monaco-editor) {
  transition: inherit !important;
}
</style>
