<template>

  <main class="flex flex-col flex-auto gap-4 items-start p-4 w-full">

    <div class="flex justify-between items-center w-full">
  
      <UButton
        icon="lucide:chevron-left"
        variant="outline"
        color="neutral"
        size="sm"
        :to="{ name: 'library-folder', params: { folder: routeParams.folder } }"
      />

      <UButton
        v-if="file"
        icon="lucide:save"
        :variant="isNewStateDifferentFromOldState ? 'solid' : 'outline'"
        color="neutral"
        size="sm"
        label="Save"
        :loading="status === 'pending'"
        :disabled="!isNewStateDifferentFromOldState || status === 'pending'"
        @click="execute({
          $fetch: {
            body: { content: editorContent, fileId: file.id, folderId: file.folder_id },
          },
        })"
      />

    </div>


    <MdEditor
      v-model="editorContent"
      no-upload-img
      :disabled="status === 'pending'"
      class="flex-auto rounded-md"
      theme="dark"
      preview-theme="default"
      code-theme="github"
      language="en-US"
      auto-detect-code
      no-katex
      :preview="false"
      show-code-row-number
      :md-heading-id="(text) => mdHeadingId(text)"
      :toolbars-exclude="[
        'github',
        'htmlPreview',
        'fullscreen',
        'sub',
        'sup',
        'save',
        'katex',
      ]"
    />
  
  </main>

</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'

const routeParams = useRoute().params
const toast = useToast()

const library = libraryStore()
const file = computed(() => library.getFileByFolderIdAndFileId(
  Number(routeParams.folder),
  Number(routeParams.file),
))

const editorContent = ref('')
const lastSavedEditorContent = ref('')

const isNewStateDifferentFromOldState = computed(() => editorContent.value !== lastSavedEditorContent.value)

let unloadHandler: ((event: BeforeUnloadEvent) => void)

onMounted(() => {

  unloadHandler = (event: BeforeUnloadEvent) => {
    if (isNewStateDifferentFromOldState.value) {
      event.preventDefault()
      event.returnValue = true
    }
  }
  window.addEventListener('beforeunload', unloadHandler)
})

onBeforeUnmount(() => {
  if (unloadHandler) {
    window.removeEventListener('beforeunload', unloadHandler)
  }
})

onBeforeRouteLeave((to, from, next) => {
  if (isNewStateDifferentFromOldState.value) {
    if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) next()
    else next(false)
  } else next()
})

const { execute, status } = useDollarFetch<AsyncSuccess<{ content: string }>, DollarFetchError>(
  '/api/library/edit-file-content', {
    $fetch: { method: 'PATCH' },
    hooks: {
      onSuccess(data) {
        editorContent.value = data.content
        lastSavedEditorContent.value = data.content
        toast.add({
          title: data.message,
          color: 'success',
          icon: 'lucide:circle-check',
        })
      },
      onError(error) {
        toast.add({
          title: error.data?.message || 'Failed to save content',
          color: 'error',
          icon: 'lucide:circle-x',
        })
      },
    },
  }, false)

watch(
  () => file.value?.content,
  (newContent) => {
    editorContent.value = newContent ?? ''
    lastSavedEditorContent.value = newContent ?? ''
  },
  { immediate: true },
)
</script>
