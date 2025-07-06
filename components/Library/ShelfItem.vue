<template>

  <main class="flex flex-col flex-auto items-start p-4 w-full">

    <div class="flex items-center rounded-sm bg-default sticky top-0 p-1">
      <UIcon
        name="codicon:markdown"
        class="size-5 shrink-0 text-warning"
      />
      <h2 class="text-xs">
        new.md
      </h2>
    </div>

    <MonacoEditor
      v-if="monaco"
      lang="markdown"
      :model-value="editorValue"
      :options="{
        theme: 'hc-black',
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
      class="grow-1 w-full"
    />

  </main>

</template>

<script lang="ts" setup>
const monaco = useMonaco()
const editorValue = ref(`# Document your code here in markdown`)
const hasEditorErrors = ref(false)

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
