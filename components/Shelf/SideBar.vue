<template>
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
        'w-64': isExpanded && !isMobile,
        'absolute top-0 left-0 z-20 w-full h-screen': isVisible && isMobile,
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
        class="flex flex-col gap-2 p-4 border-t border-default"
      >
        <UTooltip
          v-for="item in navigationItems[0]"
          :key="item.label"
          :disabled="isExpanded"
          :content="{
            side: 'right',
          }"
          :text="item.label"
        >
          <UButton
            :key="item.label"
            :label="item.label"
            :icon="item.icon"
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            variant="ghost"
            square
            :to="'to' in item ? item.to : undefined"
            :click="'action' in item ? item.action : undefined"
            active-variant="soft"
            exact
            @mouseenter="!isMobile && !isExpanded ? toggleSidebar() : null"
          />
        </UTooltip>

      </div>

      <footer class="flex flex-col gap-2 p-4 mt-auto border-t border-default">
        <UTooltip
          v-for="item in navigationItems[navigationItems.length - 1]"
          :key="item.label"
          :disabled="isExpanded"
          :content="{
            side: 'right',
          }"
          :text="item.label"
        >
          <UButton
            :key="item.label"
            :click="'action' in item ? item.action : undefined"
            :to="'to' in item ? item.to : undefined"
            active-variant="soft"
            exact
            :class="[
              'overflow-hidden transition-all duration-300',
              {
                'pr-6': !isExpanded,
              },
            ]"
            :label="item.label"
            :icon="item.icon"
            variant="ghost"
            square
          />
        </UTooltip>
      </footer>

    </aside>
  </Transition>

</template>


<script lang="ts" setup>
const { isVisible, isExpanded, toggleSidebar, isMobile } = useSideBar()

const navigationItems = [
  [
    {
      icon: 'lucide:library',
      label: 'Shelf',
      to: '/shelf',
    },
  ],
  [
    {
      icon: 'lucide:log-out',
      label: 'Logout',
      action: () => {},
    },
  ],
]
</script>
