<template>

  <MdPreview
    id="keepdotdev-markdown-preview"
    :model-value="file.content"
    theme="dark"
    preview-theme="default"
    class="flex-auto rounded-md p-4"
    code-theme="github"
    language="en-US"
    show-code-row-number
    :md-heading-id="(text) => text.trim().toLowerCase().replace(/[^\w]+/g, '-')"
  />

</template>

<script setup>
import { MdPreview } from 'md-editor-v3'

const routeParams = useRoute().params
const library = libraryStore()

const file = computed(() => library.getFileByFolderIdAndFileId(Number(routeParams.folder), Number(routeParams.file)))
</script>
