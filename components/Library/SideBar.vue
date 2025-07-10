<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >

    <div
      v-if="isOpen"
      class="fixed inset-0 z-20 w-full min-h-dvh bg-elevated/75 md:hidden"
      @click="toggle"
    />
  </Transition>

  <aside
    :class="[
      'overflow-hidden transition-all flex flex-col border-x border-default bg-default duration-300 min-h-dvh',
      isOpen
        ? 'max-w-2xs w-full md:max-w-2xs md:relative md:top-0 md:left-0'
        : 'max-w-16 w-full md:max-w-16 md:relative md:top-0 md:left-0',
      'fixed top-0 left-0 z-30 md:static md:z-auto',
      'md:flex',
      !isOpen ? 'hidden md:flex' : 'block',
    ]"
  >
    <header class="flex justify-between items-center p-4">
      <Logo v-show="isOpen" />
      <UTooltip
        :content="{ side: 'right' }"
        :text="isOpen ? 'Minimize Sidebar' : 'Expand Sidebar'"
      >
        <UButton
          icon="lucide:panel-left-open"
          variant="ghost"
          @click="toggle"
        />
      </UTooltip>
    </header>

    
    <div
      role="navigation"
      class="flex flex-col gap-4 p-4 border-t border-default"
    >
      <UTooltip
        :disabled="isOpen"
        :content="{ side: 'right' }"
        text="New Shelf"
      >
        <UButton
          label="New Shelf"
          icon="lucide:plus"
          variant="soft"
          square
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isOpen }]"
          exact
          @click="newAndEditShelfModal.open()"
        />
      </UTooltip>


      
      <UTooltip
        :disabled="isOpen"
        :content="{ side: 'right' }"
        text="Mega Search"
      >
        <UButton
          label="Mega Search"
          icon="lucide:search"
          variant="ghost"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isOpen }]"
          square
        />
      </UTooltip>
      <UTooltip
        :disabled="isOpen"
        :content="{ side: 'right' }"
        text="Ask AI"
      >
        <UButton
          label="Ask AI"
          icon="lucide:bot"
          variant="ghost"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isOpen }]"
          square
        />
      </UTooltip>
    </div>

    <div
      role="navigation"
      class="flex flex-col gap-4 p-4 border-t border-default"
    >
      <UTooltip
        :disabled="isOpen"
        :content="{ side: 'right' }"
        text="Library"
      >
        <UButton
          label="Library"
          icon="lucide:library"
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isOpen }]"
          variant="ghost"
          square
          to="/library"
          active-variant="soft"
          exact
          @click="() => {
            if (isOpen) {
              isOpen = false
            }
          }"
        />
      </UTooltip>
    </div>

    <footer class="flex flex-col gap-2 p-4 mt-auto border-t border-default">
      <UTooltip
        :disabled="isOpen"
        :content="{ side: 'right' }"
        text="Logout"
      >
        <UButton
          active-variant="soft"
          exact
          :class="['overflow-hidden transition-all duration-300', { 'pr-6': !isOpen }]"
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
import { LazyLibraryNewAndEditShelfModal, LazyLibrarySignOutModal } from '#components'

const { isOpen, toggle } = useSideBar()
const overlay = useOverlay()
const signOutModal = overlay.create(LazyLibrarySignOutModal)
const newAndEditShelfModal = overlay.create(LazyLibraryNewAndEditShelfModal)
</script>

