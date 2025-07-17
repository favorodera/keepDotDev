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

    <div
      v-if="file"
      class="flex flex-col flex-auto gap-2 w-full"
      :disabled="status === 'pending'"
    >

      <UTabs
        :items="[
          { label: 'Edit', slot: 'edit' as const, icon: 'lucide:code' },
          { label: 'Preview', slot: 'preview' as const, icon: 'lucide:play' },
        ]"
        :ui="{
          root: 'flex-auto w-full',
          content: 'flex-auto flex flex-col p-4 max-h-[80dvh] border border-default rounded-md editor-tab-content-container',
        }"
        size="xs"
        :unmount-on-hide="false"
      >
        
        <template #edit>

          <MdEditor
            v-model="editorContent"
            class="flex-auto"
            theme="dark"
            preview-theme="default"
            code-theme="github"
            language="english"
            :toolbars-exclude="[
              'github',
              'htmlPreview',
              'katex',
              'fullscreen',
            ]"
          />
        </template>

        <template #preview>

          <span
            v-dompurify-html="compiledEditorContent"
            class="prose"
            @click="copyCodeBlock"
          />
        </template>
      
      </UTabs>
  
    </div>

  </main>

</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'

const routeParams = useRoute().params
const { markdown, copyCodeBlock } = handleMarkdown()
const toast = useToast()

const library = libraryStore()
const file = computed(() => library.getFileByFolderIdAndFileId(
  Number(routeParams.folder),
  Number(routeParams.file),
))

const editorContent = ref('')
const lastSavedEditorContent = ref('')
const compiledEditorContent = computed(() => markdown.render(editorContent.value || ''))

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
