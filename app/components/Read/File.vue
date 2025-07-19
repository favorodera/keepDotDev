<template>

  <section class="flex flex-col flex-auto w-full">

    <UCollapsible
      :unmount-on-hide="false"
      :ui="{
        root: 'lg:hidden sticky top-20 z-20 bg-default backdrop-blur overflow-auto backdrop border-b border-default p-4 border-dashed',
      }"
    >

      <UButton
        label="On this page"
        variant="link"
        trailing-icon="lucide:chevron-down"
        block
        :ui="{
          base: 'lg:hidden group',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
      />

      <template #content>
        <MdCatalog
          scroll-element="html"
          editor-id="keepdotdev-markdown-preview"
          class="p-2"
          :md-heading-id="(text) => mdHeadingId(text)"
          :offset-top="500"
          @on-click="(event, toc:TocItem) => navigateTo({ hash: `#${mdHeadingId(toc.text)}` })"
        />
      </template>
    
    </UCollapsible>

    <MdPreview
      id="keepdotdev-markdown-preview"
      :model-value="file.content"
      theme="dark"
      preview-theme="default"
      class="flex-auto p-4"
      code-theme="github"
      language="en-US"
      show-code-row-number
      :md-heading-id="(text) => mdHeadingId(text)"
    />

    <ClientOnly>
      <Teleport to="#read-catalog-teleport-holder">

        <aside class="hidden sticky top-0 z-20 flex-col col-span-2 w-full lg:flex h-dvh min-h-dvh border-x border-default">

          <p class="px-4 py-7 border-b border-default">
            On this page
          </p>

          <MdCatalog
            scroll-element="html"
            editor-id="keepdotdev-markdown-preview"
            class="p-2"
            :md-heading-id="(text) => mdHeadingId(text)"
            :offset-top="500"
            @on-click="(event, toc:TocItem) => navigateTo({ hash: `#${mdHeadingId(toc.text)}` })"
          />
        </aside>

      </Teleport>

    </ClientOnly>
    
    <footer class="py-4 px-2 w-full flex gap-4 justify-between border-t border-default">
      <UButton
        v-if="prevFile"
        :label="prevFile.name"
        icon="lucide:arrow-left"
        variant="link"
        color="neutral"
        :to="{ name: 'read-folder-file', params: { folder: prevFile.folder_id, file: prevFile.id } }"
        :ui="{ base: 'justify-start w-30', label: 'overflow-ellipsis ' }"
      />

      <UButton
        v-if="nextFile"
        :label="nextFile.name"
        variant="link"
        color="neutral"
        icon="lucide:arrow-right"
        trailing
        :to="{ name: 'read-folder-file', params: { folder: nextFile.folder_id, file: nextFile.id } }"
        :ui="{ base: 'justify-end ml-auto w-30', label: 'overflow-ellipsis ' }"
      />
    </footer>

  </section>

</template>

<script lang="ts" setup>
import { MdPreview, MdCatalog } from 'md-editor-v3'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import type { File } from '~~/shared/types/app'

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
