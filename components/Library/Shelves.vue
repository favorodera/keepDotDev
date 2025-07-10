<template>

  <main
    class="flex flex-col items-start flex-auto w-full p-4"
  >

    <template v-if="shelvesFetchStatus === 'success' && shelves.length > 0">
      <section class="flex flex-col justify-between flex-auto w-full gap-4">

        <TransitionGroup
          ref="shelvesGridContainer"
          :key="page"
          enter-active-class="transition-all duration-300"
          move-class="transition-all duration-300"
          enter-from-class="translate-y-4 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="absolute transition-all duration-300"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-4 opacity-0"
          tag="section"
          class="grid grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))] flex-auto w-full gap-4 auto-rows-min"
        >

          <ULink
            v-for="shelf in paginatedShelves"
            :key="shelf.id"
            class="relative flex flex-col gap-2 p-3 transition-all duration-300 border border-default hover:-translate-y-0.5 shelf-card"
            :to="{ name: 'library-shelf', params: { shelf: shelf.id } }"
          >

            <header class="flex items-center justify-between w-full gap-2">
              
              <div class="flex items-center w-full gap-2 text-sm capitalize text-default">
                <UIcon
                  name="lucide:folder"
                  class="shrink-0"
                />

                <h3 class="break-all line-clamp-1">{{ shelf.name }}</h3>
              </div>

              <UDropdownMenu
                :key="shelf.id"
                :items="[
                  {
                    label: 'Edit',
                    icon: 'lucide:edit',
                    onSelect: () => {
                      newAndEditShelfModal.open({
                        shelf: {
                          name: shelf.name,
                          description: shelf.description,
                          tags: shelf.tags,
                          id: shelf.id,
                          owner_id: shelf.owner_id,
                        },
                      })
                    },
                  },
                  {
                    label: 'Delete',
                    icon: 'lucide:trash',
                    onSelect: () => {
                      shelfDeleteConfirmationModal.open({
                        shelf: {
                          name: shelf.name,
                          id: shelf.id,
                        },
                      })
                    },
                    color: 'error',
                  },
                ]"
                :content="{
                  align: 'start',
                  side: 'right',
                }"
              >

                <UButton
                  variant="ghost"
                  color="neutral"
                  icon="lucide:ellipsis-vertical"
                  size="sm"
                />
                 
              </UDropdownMenu>
            </header>

            <p class="capitalize line-clamp-2 text-muted text-xs">{{ shelf.description }}</p>
            
            <div class="flex items-center justify-between pt-2 mt-auto">
              <span class="text-xs text-muted">{{ getShelfItemsByShelfId(shelf.id).length }} item{{ getShelfItemsByShelfId(shelf.id).length > 1 ? 's' : '' }}</span>

              <UButton
                :icon="shelf.starred ? 'custom:star-filled': 'lucide:star' "
                :loading="starUnstarShelfStatus === 'pending' && shelfIdRef === shelf.id"
                variant="ghost"
                color="neutral"
                size="sm"
                @click.prevent.stop="async () => {
                  shelfIdRef = shelf.id
                  await starUnstarShelf({
                    body: {
                      action: shelf.starred ? 'unstar' : 'star',
                      shelfId: shelf.id,
                    },
                  })
                  shelfIdRef = undefined
                }"
              />
            </div>
              
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
        icon="lucide:circle-x"
        class="max-w-md m-auto"
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

    <template v-if="shelvesFetchStatus === 'pending'">
      <UAlert
        title="Loading shelves..."
        color="neutral"
        variant="soft"
        icon="lucide:loader-circle"
        class="max-w-md m-auto"
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
        class="max-w-md m-auto"
        :actions="[
          {
            label: 'Create a shelf',
            onClick: () => {
              newAndEditShelfModal.open()
            },
            icon: 'lucide:plus',
          },
        ]"
      />
    </template>
  </main>

</template>

<script lang="ts" setup>
import { LazyLibraryNewAndEditShelfModal, LazyLibraryShelfDeleteConfirmationModal } from '#components'

const { getShelves } = shelvesStore()
const { getShelfItemsByShelfId } = shelvesItemsStore()
const {
  shelves,
  shelvesFetchStatus,
  shelvesFetchError,
} = storeToRefs(shelvesStore())

const {
  data: starUnstarShelfData,
  status: starUnstarShelfStatus,
  error: starUnstarShelfError,
  execute: starUnstarShelf,
} = useDollarFetch<AsyncSuccess, DynamicFetchError>('/api/shelves/star-unstar', {
  method: 'PATCH',
}, false)

const shelfIdRef = ref<number>()

const toast = useToast()
const overlay = useOverlay()
const newAndEditShelfModal = overlay.create(LazyLibraryNewAndEditShelfModal)
const shelfDeleteConfirmationModal = overlay.create(LazyLibraryShelfDeleteConfirmationModal)

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

    if (!entry) {
      itemsPerPage.value = 3
      return
    }

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
}, { immediate: true, deep: true })

watch([
  starUnstarShelfStatus,
  starUnstarShelfError,
  starUnstarShelfData,
], ([
  newStatus,
  newError,
  newData,
]) => {
  if (newStatus === 'success' && newData) {
    toast.add({
      title: newData.message,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  }

  if (newStatus === 'error' && newError) {
    toast.add({
      title: newError.data?.message || 'Failed to star/unstar shelf',
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
}, { immediate: true, deep: true })

</script>

<style scoped lang="css">
:deep(.shelf-card) {
  border-radius: 0 0.5rem 0.5rem 0.5rem;

  & ::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: -1px;
    width: 50%;
    height: 1rem;
    background-color: var(--ui-bg);
    border: 1px solid var(--ui-border);
    border-radius: 0.5rem 0.5rem 0 0;
  }
}
</style>
