<template>

  <section class="flex flex-col w-full relative">

    <MdPreview
      id="keepdotdev-markdown-preview"
      :model-value="file.content"
      theme="dark"
      preview-theme="default"
      class="flex-auto p-4 rounded-md"
      code-theme="github"
      language="en-US"
      show-code-row-number
      :md-heading-id="(text) => mdHeadingId(text)"
    />

    <ClientOnly>
      <Teleport to="#read-catalog-teleport-holder">

        <aside class="hidden sticky top-0 z-20 flex-col w-64 md:flex min-w-64 h-dvh min-h-dvh border-x border-default">

          <p class="px-4 py-7 border-b border-default">
            On this page
          </p>

          <MdCatalog
            scroll-element="html"
            editor-id="keepdotdev-markdown-preview"
            class="p-2 "
            :md-heading-id="(text) => mdHeadingId(text)"
            :offset-top="500"
            @on-click="(event, toc:TocItem) => router.push({ hash: `#${mdHeadingId(toc.text)}` })"
          />
        </aside>

      </Teleport>
    </ClientOnly>
    
    <footer class="flex flex-wrap gap-8 justify-between p-4 w-full">

      <UButton
        v-if="prevFile"
        :label="prevFile.name"
        icon="lucide:arrow-left"
        variant="soft"
        color="neutral"
        size="lg"
        :to="{ name: 'read-folder-file', params: { folder: prevFile.folder_id, file: prevFile.id } }"
      />

      <UButton
        v-if="nextFile"
        :label="nextFile.name"
        variant="soft"
        color="neutral"
        size="lg"
        icon="lucide:arrow-right"
        :to="{ name: 'read-folder-file', params: { folder: nextFile.folder_id, file: nextFile.id } }"
      />

    </footer>

  </section>

</template>

<script lang="ts" setup>
import { MdPreview, MdCatalog } from 'md-editor-v3'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import type { File } from '~~/shared/types/app'

const router = useRouter()

const routeParams = useRoute().params
const library = libraryStore()
const folder = computed(() => library.getFolderById(Number(routeParams.folder)))

const file = computed(() => library.getFileByFolderIdAndFileId(Number(routeParams.folder), Number(routeParams.file)) || {} as File)

const fileId = computed(() => file.value?.id)

const currentFileIndex = computed(() => {
  if (!folder.value) return -1
  return folder.value.files.findIndex(file => file.id === fileId.value)
})

const prevFile = computed(() => {
  if (!folder.value) return null
  if (currentFileIndex.value > 0) {
    return folder.value.files[currentFileIndex.value - 1]
  }
  return null
})

const nextFile = computed(() => {
  if (!folder.value) return null
  if (
    currentFileIndex.value !== -1
    && currentFileIndex.value < folder.value.files.length - 1
  ) {
    return folder.value.files[currentFileIndex.value + 1]
  }
  return null
})
</script>
