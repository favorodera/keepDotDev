<template>

  <main
    class="flex flex-col flex-auto items-start p-4 w-full"
  >

    <UButton
      size="xs"
      :label="shelvesFetchStatus === 'pending' && isThisDataRefresh ? 'Refreshing...' : 'Refresh'"
      icon="lucide:refresh-cw"
      :loading="shelvesFetchStatus === 'pending' && isThisDataRefresh"
      :disabled="shelvesFetchStatus === 'pending'"
      variant="ghost"
      color="neutral"
      class="mb-4 ml-auto"
      @click="refresh()"
    />

    <template v-if="(shelvesFetchStatus === 'success' || isThisDataRefresh) && shelves.length > 0">
      <section class="flex flex-col flex-auto gap-4 justify-between w-full">

        <TransitionGroup
          ref="shelvesGridContainer"
          :key="page"
          enter-active-class="transition-all duration-300"
          move-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transition-all duration-300"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          tag="section"
          class="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] overflow-hidden flex-auto w-full gap-4 auto-rows-min"
        >
          <ULink
            v-for="shelf in paginatedShelves"
            :key="shelf.id"
            class="flex flex-col gap-2 p-4 relative rounded-md border transition-all duration-300 shelf-card hover:shadow border-default hover:shadow-neutral-700"
            :to="`/library/shelf-${shelf.id}`"
          >

            <header class="flex flex-col items-start">
              <h2 class="font-semibold text-md text-default line-clamp-1">
                {{ shelf.name }}
              </h2>
              <p class="text-sm text-muted line-clamp-2">
                {{ shelf.description }}
              </p>

              <div class="flex flex-wrap gap-2 items-center mt-2">
                <span
                  v-for="tag in shelf.tags"
                  :key="tag"
                  class="p-1 text-xs rounded-md text-muted bg-elevated/75"
                >
                  #{{ tag }}
                </span>
              </div>
            </header>

            <!-- Dropdown for edit,delete,star -->
       

          </ULink>
        </TransitionGroup>

        <UPagination
          v-model:page="page"
          :total="shelves.length"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          show-edges
          size="sm"
          :ui="{
            list: 'flex flex-wrap gap-2 items-center justify-center',
          }"
        />

      </section>
    </template>

    <template v-if="shelvesFetchStatus === 'error' && shelvesFetchError">
        
      <UAlert
        :title="shelvesFetchError.data?.message || 'Failed to load library'"
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

const { refresh } = await useLazyAsyncData('all-shelves', () => getShelves())

const shelvesGridContainer = useTemplateRef('shelvesGridContainer')
const itemsPerPage = ref(1)
const page = ref(1)


const paginatedShelves = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return shelves.value.slice(start, end)
})

function calculateItemsPerPage(entries: readonly ResizeObserverEntry[]) {
  nextTick(() => {
    const entry = entries[0]

    const gap = 16
    const cardElement = document.querySelector('.shelf-card')

    if (!cardElement) {
      itemsPerPage.value = 3
      return
    }

    const cardWidth = cardElement.clientWidth
    const cardHeight = cardElement.clientHeight

    const containerWidth = entry.contentRect.width
    const containerHeight = entry.contentRect.height

    const cardsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap))
    const rowsPerPage = Math.floor((containerHeight + gap) / (cardHeight + gap))

    itemsPerPage.value = Math.max(1, cardsPerRow * rowsPerPage)
  })
}

const debounceCalculateItemsPerPage = useDebounceFn(calculateItemsPerPage, 100)

useResizeObserver(shelvesGridContainer, (entries) => {
  return debounceCalculateItemsPerPage(entries)
}, {
  box: 'border-box',
})


watch(itemsPerPage, (newPerPage) => {
  const total = shelves.value.length
  const maxPage = Math.max(1, Math.ceil(total / newPerPage))
  if (page.value > maxPage) {
    page.value = maxPage
  }
})

</script>
