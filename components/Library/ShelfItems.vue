<template>

  <main
    class="flex flex-col items-start flex-auto w-full gap-4 p-4"
  >

    <template v-if="shelvesItemsFetchStatus === 'success' ">

      <div class="flex items-center justify-between w-full gap-2">
        <UButton
          icon="lucide:chevron-left"
          variant="link"
          color="neutral"
          size="sm"
          label="Back"
          :ui="{ base: 'p-0' }"
          to="/library"
        />

        <UPopover
          v-model:open="isPopoverOpen"
          :ui="{
            content: 'p-4',
          }"
        >

          <UButton
            icon="lucide:plus"
            label="Add item"
            size="sm"
            variant="soft"
            color="neutral"
          />

          <template #content>

            <UForm
              :state
              class="space-y-4"
              :schema
              @submit="onSubmit"
            >
              <UFormField
                required
                name="name"
                label="Name"
              >

                <UInput
                  v-model="state.name"
                  :disabled=" newShelfItemStatus=== 'pending'"
                  :ui="{
                    root: 'w-full',
                  }"
                  placeholder="Enter item name"
                />
              </UFormField>

           
              <UButton
                label="Add"
                :loading="newShelfItemStatus === 'pending'"
                :disabled="newShelfItemStatus === 'pending'"
                color="primary"
                size="sm"
                type="submit"
                variant="soft"
                block
              />
            

            </UForm>
          
          </template>

        </UPopover>

      </div>

    </template>

    <template v-if="shelvesItemsFetchStatus === 'success' && paginatedShelvesItems.length > 0">
      <section class="flex flex-col justify-between flex-auto w-full gap-4">

        <TransitionGroup
          ref="shelvesItemsGridContainer"
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
            v-for="shelfItem in paginatedShelvesItems"
            :key="shelfItem.id"
            class=" flex flex-col gap-2 p-3 transition-all duration-300 border border-default hover:-translate-y-0.5 rounded-md"
            :to="{ name: 'library-shelf-item', params: { shelf: routeParams.shelf, item: shelfItem.id } }"
          >
        
            <header class="flex items-center w-full gap-1 text-sm capitalize text-default">

              <UIcon
                name="lucide:file-code"
                class="shrink-0"
              />

              <h3 class="break-all line-clamp-1">{{ shelfItem.name }}</h3>

            </header>

            <div class="flex items-center justify-between w-full gap-2 pt-2 mt-auto">

              <div class="flex items-center gap-1 text-muted text-xs">
                <UIcon
                  name="lucide:calendar"
                />

                <NuxtTime
                  :datetime="shelfItem.updated_at"
                  relative
                />

              </div>

              <UButton
                variant="ghost"
                color="error"
                icon="lucide:trash"
                size="sm"
                @click.prevent.stop="shelfItemDeleteConfirmationModal.open({
                  shelfItem: {
                    id: shelfItem.id,
                    name: shelfItem.name,
                    shelf_id: shelfItem.shelf_id,
                  },
                })"
              />

            </div>
        
          </ULink>
      
        </TransitionGroup>

        <UPagination
          v-model:page="page"
          :total="paginatedShelvesItems.length"
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

    <template v-if="shelvesItemsFetchStatus === 'error' && shelvesItemsFetchError">
        
      <UAlert
        :title="shelvesItemsFetchError.data?.message || 'Failed to load shelf items'"
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
              await getShelvesItems()
            },
            color: 'primary',
            variant: 'solid',
            icon: 'lucide:refresh-cw',
          },
        ]"
      />

    </template>

    <template v-if="shelvesItemsFetchStatus === 'pending'">
      <UAlert
        title="Loading shelf items..."
        color="neutral"
        variant="soft"
        icon="lucide:loader-circle"
        class="max-w-md m-auto"
        :ui="{
          icon: 'animate-spin',
        }"
      />
    </template>
    
    <template v-if="shelvesItemsFetchStatus === 'success' && paginatedShelvesItems.length === 0">
      <UAlert
        title="No shelf item found!"
        color="neutral"
        variant="soft"
        icon="lucide:file-x"
        :ui="{
          actions: 'justify-end',
        }"
        class="max-w-md m-auto"
      />
    </template>

  </main>

</template>

<script lang="ts" setup>
import { z } from 'zod'
import { LazyLibraryShelfItemDeleteConfirmationModal } from '#components'

const isPopoverOpen = ref(false)
const toast = useToast()
const routeParams = useRoute().params
const shelvesItemsGridContainer = useTemplateRef('shelvesItemsGridContainer')
const itemsPerPage = ref(1)
const page = ref(1)
const overlay = useOverlay()
const shelfItemDeleteConfirmationModal = overlay.create(LazyLibraryShelfItemDeleteConfirmationModal)

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

useResizeObserver(shelvesItemsGridContainer, (entries) => {
  return debounceCalculateItemsPerPage(entries)
}, {
  box: 'border-box',
})


const { getShelvesItems, getShelfItemsByShelfId } = shelvesItemsStore()

const {
  shelvesItemsFetchStatus,
  shelvesItemsFetchError,
} = storeToRefs(shelvesItemsStore())


const paginatedShelvesItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return getShelfItemsByShelfId(Number(routeParams.shelf)).slice(start, end)
})

const schema = z.object({
  name: z.string().min(1, 'File name is required!'),
})
const state = reactive<z.output<typeof schema>>({
  name: '',
})

const {
  data: newShelfItemData,
  execute: createNewShelfItem,
  status: newShelfItemStatus,
  error: newShelfItemError,
} = useDollarFetch<AsyncSuccess, AsyncError>('/api/shelves-items/new', {
  method: 'POST',
}, false)


function onSubmit() {
  createNewShelfItem({
    body: {
      name: state.name,
      shelfId: routeParams.shelf,
    },
  })
}

watch([newShelfItemData, newShelfItemStatus, newShelfItemError], ([newData, newStatus, newError]) => {
  if (newStatus === 'success' && newData) {

    isPopoverOpen.value = false

    state.name = ''

    toast.add({
      title: newData.message,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  } else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || 'Error creating file',
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
}, { immediate: true })

watch(itemsPerPage, (newPerPage) => {
  const total = paginatedShelvesItems.value.length
  const maxPage = Math.max(1, Math.ceil(total / newPerPage))
  if (page.value > maxPage) {
    page.value = maxPage
  }
}, { immediate: true, deep: true })
</script>
