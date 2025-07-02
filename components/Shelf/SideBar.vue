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
      v-if="isVisible && isMobile"
      class="fixed top-0 left-0 z-20 w-full h-dvh bg-elevated/75 backdrop-blur-sm transition-all duration-300"
      @click="toggleSidebar"
    />
  </Transition>
  
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 -translate-x-full"
  >
    <aside
      v-if="isVisible || !isMobile"
      :class="{
        'overflow-hidden transition-all flex flex-col border-x border-default bg-default': true,
        'w-16': !isExpanded && !isMobile,
        'w-2xs': isExpanded && !isMobile,
        'absolute top-0 left-0 z-20 w-full max-w-2xs h-dvh': isVisible && isMobile,
        'hidden': !isVisible && isMobile,
      }"
      class="transition-all duration-300"
    >

      <header class="flex justify-between items-center p-4">
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <Logo v-show="isExpanded || isVisible" />
        </Transition>

        <UTooltip
          :content="{
            side: 'right',
          }"
          :text="isMobile ? 'Close Sidebar' : isExpanded ? 'Minimize Sidebar' : 'Expand Sidebar'"
        >
          <UButton
            icon="lucide:panel-left-open"
            variant="ghost"
            @click="toggleSidebar"
          />
        </UTooltip>

      </header>

      <div
        role="navigation"
        class="flex flex-col gap-4 p-4 border-t border-default"
      >
    
        <UTooltip
          :disabled="isExpanded || isMobile"
          :content="{
            side: 'right',
          }"
          text="New Shelf"
        >
          <UButton
            label="New Shelf"
            icon="lucide:plus"
            variant="solid"
            square
            to="/library/new"
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            exact
          />
        </UTooltip>

        <UTooltip
          :disabled="isExpanded || isMobile"
          :content="{
            side: 'right',
          }"
          text="Mega Search"
        >
          <UButton
            label="Mega Search"
            icon="lucide:search"
            variant="outline"
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            square
          />
        </UTooltip>

        <UTooltip
          :disabled="isExpanded || isMobile"
          :content="{
            side: 'right',
          }"
          text="Ask AI"
        >
          <UButton
            label="Ask AI"
            icon="lucide:bot"
            variant="outline"
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            square
          />
        </UTooltip>

      </div>

      <div
        role="navigation"
        class="flex flex-col gap-4 p-4 border-t border-default"
      >

        <UTooltip
          :disabled="isExpanded || isMobile"
          :content="{
            side: 'right',
          }"
          text="Library"
        >
          <UButton
            label="Library"
            icon="lucide:library"
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            variant="outline"
            square
            to="/library"
            active-variant="subtle"
            exact
          />
        </UTooltip>

      </div>


      <footer class="flex flex-col gap-2 p-4 mt-auto border-t border-default">
        <UTooltip
          :disabled="isExpanded || isMobile"
          :content="{
            side: 'right',
          }"
          text="Logout"
        >
          <UButton
            active-variant="soft"
            exact
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
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
  </Transition>

</template>


<script lang="ts" setup>
import { LazyShelfSignOutModal } from '#components'

const { isVisible, isExpanded, toggleSidebar, isMobile, toggleVisibility, toggleExpansion } = useSideBar()
const overlay = useOverlay()

const signOutModal = overlay.create(LazyShelfSignOutModal)

watch([isVisible, isExpanded, isMobile], ([visible, expanded, mobile]) => {
  if (visible && !mobile) {
    toggleVisibility()
  } else if (expanded && mobile) {
    toggleExpansion()
  }
}, {
  immediate: true,
})

</script>

