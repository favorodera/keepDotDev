<template>

  <main
    class="flex flex-col items-start flex-auto w-full gap-8 p-4"
  >

    <template v-if="shelvesFetchStatus === 'success' ">

      <div class="flex items-center justify-end w-full gap-2">

        <UPopover
          v-mode:open="isPopoverOpen"
          arrow
          :content="{
            align: 'end',
          }"
          :ui="{
            content: 'bg-default p-4 max-w-35',
          }"
        >
          <UButton
            icon="lucide:settings"
            :label="`${state.shelvesPerPage} Shelves per page`"
            size="sm"
            variant="soft"
            color="neutral"
          />

          <template #content>

            <UForm
              :state
              :schema
              class="space-y-2"
              @submit="onSubmit"
            >

              <UFormField name="shelvesPerPage">
                <UInputNumber
                  v-model="state.shelvesPerPage"
                  variant="subtle"
                  color="neutral"
                  :min="3"
                  :ui="{
                    increment: 'hidden',
                    decrement: 'hidden',
                  }"
                />
              </UFormField>

              <UButton
                type="submit"
                label="Set"
                color="neutral"
                variant="subtle"
                block
              />

            </UForm>
            
          </template>

        </UPopover>

      </div>

    </template>

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
          :items-per-page="shelvesPerPage"
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
import { z } from 'zod'
import { LazyLibraryModalsNewAndEditShelf, LazyLibraryModalsShelfDeleteConfirmation } from '#components'

const user = useSupabaseUser()
const client = useSupabaseClient<Database>()

const { updateUser } = useAuth()
const isPopoverOpen = ref(false)
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

const schema = z.object({
  shelvesPerPage: z.number().int().min(3, 'Shelves per page must be at least 3'),
})

const state = reactive<z.output<typeof schema>>({
  shelvesPerPage: user.value?.user_metadata.shelvesPerPage || 10,
})

const shelfIdRef = ref<number>()

const toast = useToast()
const overlay = useOverlay()
const newAndEditShelfModal = overlay.create(LazyLibraryModalsNewAndEditShelf)
const shelfDeleteConfirmationModal = overlay.create(LazyLibraryModalsShelfDeleteConfirmation)

const page = ref(1)

const shelvesPerPage = computed(() => state.shelvesPerPage)
const paginatedShelves = computed(() => {
  const start = (page.value - 1) * shelvesPerPage.value
  const end = start + shelvesPerPage.value
  return shelves.value.slice(start, end)
})

async function onSubmit() {
  await updateUser({ shelvesPerPage: state.shelvesPerPage })

  toast.add({
    title: `Shelves per page set to ${state.shelvesPerPage}`,
    color: 'success',
    icon: 'lucide:circle-check',
  })
}

client.auth.onAuthStateChange((event, session) => {
  switch (event) {
    case 'USER_UPDATED':
      if (session) state.shelvesPerPage = session.user.user_metadata.shelvesPerPage || 10
      break
  }
})



watch(shelvesPerPage, (newPerPage) => {
  const total = shelves.value.length
  const maxPage = Math.max(1, Math.ceil(total / newPerPage))
  if (page.value > maxPage) {
    page.value = maxPage
  }
})

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
