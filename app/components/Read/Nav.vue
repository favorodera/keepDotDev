<template>

  <nav class="sticky top-0 z-10 p-4 w-full border-b bg-default border-default">

    <ul class="flex gap-4 justify-between items-start mx-auto w-full max-w-8xl">

      <li>
        <header>
          <h1 class="text-xl font-semibold">
            {{ folder?.name }}
          </h1>
          <p class="text-sm text-muted">
            {{ folder?.description }}
          </p>
        </header>
      </li>

      <li>
        <UDrawer
          v-model:open="isDrawerOpen"
          :ui="{
            content: 'h-dvh',
          }"
        >
          <UButton
            icon="lucide:align-right"
            variant="soft"
            color="neutral"
            size="sm"
            :ui="{ base: 'md:hidden' }"
          />

          <template #content>
            <div class="p-2 border-b border-default">
              <span class="text-xs text-muted">powered by</span>
              <Logo />
            </div>
    
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
                { label: 'To Library', icon: 'lucide:arrow-left', to: { name: 'library-folder', params: { shelf: routeParams.folder } } },
                { label: 'Docs', icon: 'lucide:book', open: true, children: [...files] },
              ]"
            />
          </template>

        </UDrawer>

      </li>

    </ul>

  </nav>
</template>

<script lang="ts" setup>
const isDrawerOpen = ref(false)
const routeParams = useRoute().params

const library = libraryStore()
const folder = computed(() => library.getFolderById(Number(routeParams.folder)))

const files = computed(() => folder.value?.files.map((file) => {
  return {
    label: file.name,
    icon: 'lucide:file-text',
    to: { name: 'read-folder-file', params: { folder: file.folder_id, file: file.id } },
    onSelect: (_event: Event) => nextTick(() => isDrawerOpen.value = false),
  }
}))

</script>
