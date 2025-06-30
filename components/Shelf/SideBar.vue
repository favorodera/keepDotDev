<template>

  <aside
    v-if="sideBarStatus !== 'hidden'"
    :class="{
      'overflow-hidden transition-all flex flex-col': true,
      'border-r border-default': sideBarStatus === 'visible-minimized' || sideBarStatus === 'visible-expanded',
      'w-16': sideBarStatus === 'visible-minimized',
      'w-64': sideBarStatus === 'visible-expanded',
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
        <Logo v-show="sideBarStatus === 'visible-expanded'" />
      </Transition>

      <UTooltip
        :content="{
          side: 'right',
        }"
        :text="sideBarStatus === 'visible-expanded' ? 'Minimize Sidebar' : 'Expand Sidebar'"
      >
        <UButton
          icon="lucide:sidebar-open"
          variant="ghost"
          @click="setSideBarStatus(sideBarStatus === 'visible-expanded' ? 'visible-minimized' : 'visible-expanded')"
        />
      </UTooltip>

    </header>

    <div
      role="navigation"
      class="p-4 flex flex-col gap-2 border-t border-default"
    >
      <UTooltip
        v-for="item in navigationItems[0]"
        :key="item.label"
        :disabled="sideBarStatus === 'visible-expanded'"
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
              'pr-6': sideBarStatus === 'visible-minimized',
            },
          ]"
          variant="ghost"
          square
          :to="'to' in item ? item.to : undefined"
          :click="'action' in item ? item.action : undefined"
          active-variant="soft"
          exact
        />
      </UTooltip>

    </div>

    <footer class="p-4 flex flex-col gap-2 mt-auto border-t border-default">
      <UTooltip
        v-for="item in navigationItems[navigationItems.length - 1]"
        :key="item.label"
        :disabled="sideBarStatus === 'visible-expanded'"
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
              'pr-6': sideBarStatus === 'visible-minimized',
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

</template>

<script lang="ts">
type SideBarStatus = 'visible' | 'hidden' | 'visible-minimized' | 'visible-expanded'
</script>

<script lang="ts" setup>

const sideBarStatus = ref<SideBarStatus>('visible-minimized')

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

function setSideBarStatus(status: SideBarStatus) {
  sideBarStatus.value = status
}

defineExpose({
  sideBarStatus,
  setSideBarStatus,
})
</script>
