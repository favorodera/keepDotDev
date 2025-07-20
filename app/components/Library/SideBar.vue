<template>
  <aside
    class="hidden md:flex flex-col h-dvh min-h-dvh sticky top-0 w-full border-x border-default bg-default transition-all duration-300"
    :class="isExpanded ? 'max-w-2xs' : 'max-w-16'"
    @click.self.prevent.stop="toggleExpansion"
  >
    <header class="flex justify-between items-center p-4">

      <Logo v-show="isExpanded" />

      <UTooltip
        :content="{ side: 'right' }"
        :text="isExpanded ? 'Minimize Sidebar' : 'Expand Sidebar'"
      >
        <UButton
          icon="lucide:panel-left-open"
          variant="ghost"
          @click="toggleExpansion"
        />
      </UTooltip>
    </header>

    <div
      role="navigation"
      class="flex flex-col gap-4 p-4 border-t border-default"
    >
      <UTooltip
        :disabled="isExpanded"
        :content="{ side: 'right' }"
        text="New Folder"
      >
        <UButton
          label="New Folder"
          icon="lucide:plus"
          variant="soft"
          square
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isExpanded }]"
          exact
          @click="newAndEditFolderModal.open()"
        />
      </UTooltip>
      <UTooltip
        :disabled="isExpanded"
        :content="{ side: 'right' }"
        text="Search"
      >
        <UButton
          label="Search"
          icon="lucide:search"
          variant="ghost"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isExpanded }]"
          square
          @click="searchModal.open()"
        />
      </UTooltip>
      <UTooltip
        :disabled="isExpanded"
        :content="{ side: 'right' }"
        text="Ask AI"
      >
        <UButton
          label="Ask AI"
          icon="lucide:bot"
          variant="ghost"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isExpanded }]"
          square
          @click="aiChatModal.open()"
        />
      </UTooltip>
    </div>

    <div
      role="navigation"
      class="flex flex-col gap-4 p-4 border-t border-default"
    >
      <UTooltip
        :disabled="isExpanded"
        :content="{ side: 'right' }"
        text="Library"
      >
        <UButton
          label="Library"
          icon="lucide:library"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isExpanded }]"
          variant="ghost"
          square
          to="/library"
          active-variant="soft"
          exact
        />
      </UTooltip>
    </div>

    <footer class="flex flex-col gap-2 p-4 mt-auto border-t border-default">
      <UTooltip
        :disabled="isExpanded"
        :content="{ side: 'right' }"
        text="Logout"
      >
        <UButton
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isExpanded }]"
          label="Logout"
          icon="lucide:log-out"
          variant="ghost"
          color="error"
          square
          @click="signOutModal.open()"
        />
      </UTooltip>
    </footer>
  </aside>
</template>

<script lang="ts" setup>
import { LazyLibraryModalsAIChat, LazyLibraryModalsNewAndEditFolder, LazyLibraryModalsSearch, LazyLibraryModalsSignOut } from '#components'

const isExpanded = ref(false)
const overlay = useOverlay()
const signOutModal = overlay.create(LazyLibraryModalsSignOut)
const newAndEditFolderModal = overlay.create(LazyLibraryModalsNewAndEditFolder)
const aiChatModal = overlay.create(LazyLibraryModalsAIChat)
const searchModal = overlay.create(LazyLibraryModalsSearch)

function toggleExpansion() {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  isExpanded,
})
</script>

