<template>

  <main
    class="flex flex-auto p-4 w-full items-start"
  >

    <template v-if="(shelvesFetchStatus === 'success' || isThisDataRefresh) && shelves.length > 0">
      <TransitionGroup
        enter-active-class="transition-all duration-300"
        move-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 absolute"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
        tag="section"
        class="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] w-full gap-4"
      >
        <div
          v-for="shelf in shelves"
          :key="shelf.id"
          class="flex flex-col gap-2 border border-default rounded-md p-4"
        >

          <header class="flex flex-col items-start">
            <h2 class="text-md font-semibold line-clamp-1">
              {{ shelf.name }}
            </h2>
            <p class="text-sm text-muted line-clamp-2">
              {{ shelf.description }}
            </p>

            <div class="flex gap-2 items-center mt-2 flex-wrap">
              <span
                v-for="tag in shelf.tags"
                :key="tag"
                class="text-xs text-muted rounded-md bg-elevated/75 p-1"
              >
                #{{ tag }}
              </span>
            </div>
          </header>

        </div>
      </TransitionGroup>
    </template>

    <template v-if="shelvesFetchStatus === 'error' && shelvesFetchError">
        
      <UAlert
        :title="shelvesFetchError?.data?.message"
        color="error"
        variant="subtle"
        icon="lucide:alert-circle"
        class="m-auto max-w-md"
        :ui="{
          actions: 'justify-end',
        }"
        :actions="[
          {
            label: 'Retry',
            onClick: async () => {
              await getShelves()
            },
            color: 'primary',
            variant: 'solid',
            icon: 'lucide:refresh-cw',
          },
        ]"
      />

    </template>

    <template v-if="shelvesFetchStatus === 'pending' && !isThisDataRefresh">
      <UAlert
        title="Loading shelves..."
        color="neutral"
        variant="soft"
        icon="lucide:loader-circle"
        class="m-auto max-w-md"
        :ui="{
          icon: 'animate-spin',
        }"
      />
    </template>

    <template v-if="shelvesFetchStatus === 'success' && shelves.length === 0">
      <UAlert
        title="No shelf found!"
        color="neutral"
        variant="soft"
        icon="lucide:file-x"
        :ui="{
          actions: 'justify-end',
        }"
        class="m-auto max-w-md"
        :actions="[
          {
            label: 'Create a shelf',
            onClick: () => {
              newShelfModal.open()
            },
            icon: 'lucide:plus',
          },
        ]"
      />
    </template>
  </main>

</template>

<script lang="ts" setup>
import { LazyLibraryNewShelfModal } from '#components'

const overlay = useOverlay()
const { getShelves } = shelvesStore()
const { shelves, shelvesFetchStatus, shelvesFetchError, isThisDataRefresh } = storeToRefs(shelvesStore())

const newShelfModal = overlay.create(LazyLibraryNewShelfModal)

await useLazyAsyncData('all-shelves', () => getShelves())

</script>
