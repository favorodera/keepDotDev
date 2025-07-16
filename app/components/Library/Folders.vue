<template>

  <main
    class="flex flex-col items-start flex-auto w-full gap-8 p-4"
  >

    <template v-if="library.status === 'success' ">

      <div class="flex items-center justify-end w-full gap-2">

        <UPopover
          v-model:open="isPopoverOpen"
          arrow
          :content="{
            align: 'end',
          }"
          :ui="{
            content: 'bg-default p-2 max-w-35',
          }"
        >
        
          <UTooltip text="Folders per page">
            <UButton
              icon="lucide:cog"
              :label="String(foldersPerPage)"
              size="sm"
              variant="soft"
              color="neutral"
            />
          </UTooltip>
         

          <template #content>

            <form
              class="space-y-2"
            >
              <input
                v-model.number="foldersPerPageInput"
                type="number"
                min="3"
                class="block w-full px-1 py-0.5 border border-default rounded text-sm focus:outline-none focus:ring"
              >
              <UButton
                type="submit"
                loading-auto
                label="Set"
                color="neutral"
                variant="subtle"
                size="xs"
                block
                :disabled="!newStateDiffersFromOldState"
                @click.prevent="onSubmit"
              />
            </form>
            
          </template>

        </UPopover>

      </div>

    </template>

    <template v-if="library.status === 'success' && library.folders.length > 0">
      <section class="flex flex-col justify-between flex-auto w-full gap-4">

        <TransitionGroup
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
            v-for="folder in paginatedFolders"
            :key="folder.id"
            class="relative flex flex-col gap-2 p-3 transition-all duration-300 border border-default hover:-translate-y-0.5 folder-card"
            :to="{ name: 'library-folder', params: { folder: folder.id } }"
          >

            <header class="flex items-center justify-between w-full gap-2">
              
              <div class="flex items-center w-full gap-2 text-sm capitalize text-default">
                <UIcon
                  name="lucide:folder"
                  class="shrink-0"
                />

                <h3 class="break-all line-clamp-1">{{ folder.name }}</h3>
              </div>

              <UDropdownMenu
                :items="[
                  {
                    label: 'Edit',
                    icon: 'lucide:edit',
                    onSelect: () => {
                      newAndEditFolderModal.open({
                        folder: {
                          name: folder.name,
                          description: folder.description,
                          id: folder.id,
                          owner_id: folder.owner_id,
                        },
                      })
                    },
                  },
                  {
                    label: 'Delete',
                    icon: 'lucide:trash',
                    onSelect: () => {
                      folderDeleteConfirmationModal.open({
                        folder: {
                          name: folder.name,
                          id: folder.id,
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

            <p class="capitalize line-clamp-2 text-muted text-xs">{{ folder.description }}</p>
            
            <div class="flex items-center justify-between pt-2 mt-auto">
              <span
                class="text-xs text-muted"
              >
                {{ library.getFolderById(folder.id)?.files.length }} file(s)
              </span>

              <UButton
                :icon="folder.starred ? 'custom:star-filled': 'lucide:star' "
                :loading="starStatus === 'pending' && folderIdRef === folder.id"
                variant="ghost"
                color="neutral"
                size="sm"
                @click.prevent.stop="async () => {
                  folderIdRef = folder.id
                  await starUnStar({
                    $fetch: {
                      method: 'PATCH',
                      body: {
                        action: folder.starred ? 'unstar' : 'star',
                        folderId: folder.id,
                      },
                    },
                  })
                  folderIdRef = undefined
                }"
              />
            </div>
              
          </ULink>
        </TransitionGroup>

        <UPagination
          v-model:page="page"
          :total="library.folders.length"
          :items-per-page="foldersPerPage"
          :sibling-count="1"
          show-edges
          size="sm"
          :ui="{
            list: 'flex flex-wrap gap-2 items-center justify-center',
          }"
        />

      </section>
    </template>

    <template v-if="library.status === 'error' && library.error">
        
      <UAlert
        :title="library.error.data?.message || 'Failed to load library'"
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
              await library.getLibrary()
            },
            color: 'primary',
            variant: 'solid',
            icon: 'lucide:refresh-cw',
          },
        ]"
      />

    </template>

    <template v-if="library.status === 'pending'">
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

    <template v-if="library.status === 'success' && library.folders.length === 0">
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
              newAndEditFolderModal.open()
            },
            icon: 'lucide:plus',
          },
        ]"
      />
    </template>
  </main>

</template>

<script lang="ts" setup>
import { LazyLibraryModalsNewAndEditFolder, LazyLibraryModalsFolderDeleteConfirmation } from '#components'

const user = useSupabaseUser()
const auth = useAuth()

const folderIdRef = ref<number>()
const library = libraryStore()

const isPopoverOpen = ref(false)
const toast = useToast()
const overlay = useOverlay()
const newAndEditFolderModal = overlay.create(LazyLibraryModalsNewAndEditFolder)
const folderDeleteConfirmationModal = overlay.create(LazyLibraryModalsFolderDeleteConfirmation)


const page = ref(1)
const defaultFoldersPerPage = 10
const foldersPerPage = ref(user.value?.user_metadata.foldersPerPage ?? defaultFoldersPerPage)
const foldersPerPageInput = ref (foldersPerPage.value)
const paginatedFolders = computed(() => {
  const start = (page.value - 1) * foldersPerPage.value
  const end = start + foldersPerPage.value
  return library.folders.slice(start, end)
})
const newStateDiffersFromOldState = computed(() => foldersPerPageInput.value !== foldersPerPage.value)



const { status: starStatus, execute: starUnStar } = useDollarFetch<AsyncSuccess, DollarFetchError>('/api/library/star-unstar-folder', {
  hooks: {
    onSuccess(data) {
      toast.add({
        title: data.message,
        color: 'success',
        icon: 'lucide:circle-check',
      })
    },
    onError(error) {
      toast.add({
        title: error.data?.message || 'Failed to star/unstar folder',
        color: 'error',
        icon: 'lucide:circle-x',
      })
    },
  },
}, false)



async function onSubmit() {

  if (foldersPerPageInput.value < 3) {
    toast.add({
      title: 'Folders per page must be at least 3',
      color: 'error',
      icon: 'lucide:circle-x',
    })
    return
  }

  foldersPerPage.value = foldersPerPageInput.value

  await auth.updateUser({ foldersPerPage: foldersPerPage.value })

  isPopoverOpen.value = false

  toast.add({
    title: `Folders per page set to ${foldersPerPage.value}`,
    color: 'success',
    icon: 'lucide:circle-check',
  })
}

watch(
  () => user.value?.user_metadata.foldersPerPage,
  newValue => foldersPerPage.value = newValue ?? defaultFoldersPerPage,
  { immediate: true },
)

watch(
  foldersPerPage,
  newValue => foldersPerPageInput.value = newValue,
  { immediate: true },
)

watch(
  foldersPerPage,
  (newValue) => {
    const total = library.folders.length
    const maxPage = Math.max(1, Math.ceil(total / newValue))
    if (page.value > maxPage) {
      page.value = maxPage
    }
  },
  { immediate: true, deep: true },
)


</script>

<style scoped lang="css">
:deep(.folder-card) {
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
