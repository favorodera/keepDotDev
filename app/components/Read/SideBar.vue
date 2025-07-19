<template>
  <aside
    class="hidden sticky top-0 z-20 flex-col lg:flex col-span-2 h-dvh min-h-dvh border-x border-default"
  >
    
    <UNavigationMenu
      color="neutral"
      variant="pill"
      arrow
      orientation="vertical"
      :ui="{
        root: 'w-full p-2',
        list: 'flex flex-col gap-2',
      }"
      :items="[
        { label: 'To Library', icon: 'lucide:arrow-left', to: { name: 'library-folder', params: { folder: routeParams.folder } } },
        { label: 'Docs', icon: 'lucide:book', open: true, children: files },
      ]"
    />

    <div class="p-4 border-t border-default mt-auto">
      <span class="text-xs text-muted">powered by</span>
      <Logo />
    </div>
  </aside>
</template>

<script lang="ts" setup>
const routeParams = useRoute().params

const library = libraryStore()

const folder = computed(() => library.getFolderById(Number(routeParams.folder)))

const files = computed(() =>
  (folder.value?.files.map(file => ({
    label: file.name,
    icon: 'lucide:file-text',
    to: { name: 'read-folder-file', params: { folder: file.folder_id, file: file.id } },
  })) || []),
)
</script>
