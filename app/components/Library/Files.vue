<template>

  <main
    class="flex flex-col flex-auto gap-4 items-start p-4 w-full"
  >

    <template v-if="library.status === 'success' ">

      <section class="flex gap-2 justify-between items-center w-full">
        
        <UTooltip text="Back">
          <UButton
            icon="lucide:chevron-left"
            variant="outline"
            color="neutral"
            size="sm"
            to="/library"
          />
        </UTooltip>

        <div class="flex gap-2 items-center">
          <UPopover
            v-model:open="isPopoverOpen"
            arrow
            :content="{ align: 'end' }"
            :ui="{ content: 'bg-default p-2 max-w-35' }"
          >
            <UTooltip text="Files per page">

              <UButton
                icon="lucide:cog"
                size="sm"
                variant="soft"
                color="neutral"
                :label="String(filesPerPage)"
              />
            </UTooltip>

            <template #content>
              <form class="space-y-2">
                <input
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

          <UTooltip text="Read Folder">
            <UButton
              v-if="paginatedFiles[0]"
              icon="lucide:book-open"
              size="sm"
              variant="soft"
              color="neutral"
            />
          </UTooltip>

          <UTooltip text="Add new file">
            <UButton
              v-if="folder"
              icon="lucide:plus"
              size="sm"
              variant="soft"
              color="neutral"
              @click="newAndEditFileModal.open({
                file: {
                  folderId: folder.id,
                },
              })"
            />
          </UTooltip>

        </div>
      </section>

      <section
        v-if="folder"
        class="flex flex-col gap-1 py-2 w-full border-y border-default"
      >
  
        <h1 class="text-base font-medium line-clamp-2">
          {{ folder.name }}
        </h1>
        
        <p class="text-xs text-muted line-clamp-2">
          {{ folder.description }}
        </p>

      </section>

        
      <template v-if="paginatedFiles.length > 0">

        <TransitionGroup
          :key="page"
          enter-active-class="transition-all duration-300"
          move-class="transition-all duration-300"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="absolute transition-all duration-300"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          tag="section"
          class="grid grid-cols-[repeat(auto-fill,minmax(min(12rem,100%),1fr))] flex-auto w-full gap-4 auto-rows-min"
        >
      
          <ULink
            v-for="file in paginatedFiles"
            :key="file.id"
            class="flex flex-col gap-2 p-3 transition-all duration-300 border border-default hover:-translate-y-0.5 rounded-md"
            to="/"
          >
        
            <header class="flex gap-1 items-center w-full text-sm capitalize text-default">

              <UIcon
                name="lucide:file-code"
                class="shrink-0"
              />

              <h3 class="break-all line-clamp-1">{{ file.name }}</h3>

            </header>

            <div class="flex gap-2 justify-between items-center pt-2 mt-auto w-full">

              <div class="flex gap-1 items-center text-xs text-muted">
                <UIcon
                  name="lucide:calendar"
                />

                <NuxtTime
                  :datetime="file.updated_at"
                  relative
                  numeric="auto"
                  style="long"
                />

              </div>

              <UDropdownMenu
                :items="[
                  {
                    label: 'Edit',
                    icon: 'lucide:edit',
                    onSelect: () => {
                      newAndEditFileModal.open({
                        file: {
                          name: file.name,
                          fileId: file.id,
                          folderId: file.folder_id,
                        },
                      })
                    },
                  },
                  {
                    label: 'Delete',
                    icon: 'lucide:trash',
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

            </div>
        
          </ULink>
      
        </TransitionGroup>

        <UPagination
          v-model:page="page"
          :total="paginatedFiles.length"
          :items-per-page="filesPerPage"
          :sibling-count="1"
          show-edges
          size="sm"
          :ui="{
            root: 'w-full',
            list: 'flex flex-wrap gap-2 items-center justify-center',
          }"
        />

      </template>

    </template>

  </main>

</template>

<script lang="ts" setup>
import { LazyLibraryModalsNewAndEditFile } from '#components'

const library = libraryStore()
const user = useSupabaseUser()
const auth = useAuth()
const routeParams = useRoute().params
const toast = useToast()
const isPopoverOpen = ref(false)

const overlay = useOverlay()

const newAndEditFileModal = overlay.create(LazyLibraryModalsNewAndEditFile)


const folder = computed(() => library.getFolderById(Number(routeParams.folder)))
const files = computed(() => folder.value?.files ?? [])

const page = ref(1)
const defaultFilesPerPage = 10
const filesPerPage = ref(user.value?.user_metadata.filesPerPage ?? defaultFilesPerPage)
const filesPerPageInput = ref(filesPerPage.value)
const paginatedFiles = computed(() => {
  const start = (page.value - 1) * filesPerPage.value
  const end = start + filesPerPage.value
  return files.value.slice(start, end)
})
const newStateDiffersFromOldState = computed(() => filesPerPageInput.value !== filesPerPage.value)

async function onSubmit() {
  if (filesPerPageInput.value < 3) {
    toast.add({
      title: 'Items per page must be at least 3',
      color: 'error',
      icon: 'lucide:circle-x',
    })
    return
  }
  filesPerPage.value = filesPerPageInput.value

  await auth.updateUser({ filesPerPage: filesPerPage.value })

  isPopoverOpen.value = false

  toast.add({
    title: `Items per page set to ${filesPerPage.value}`,
    color: 'success',
    icon: 'lucide:circle-check',
  })
}

watch(
  () => user.value?.user_metadata.filesPerPage,
  newValue => filesPerPage.value = newValue ?? defaultFilesPerPage,
  { immediate: true },
)

watch(
  filesPerPage,
  newValue => filesPerPageInput.value = newValue,
  { immediate: true },
)

watch(filesPerPage, (newPerPage) => {
  const total = files.value.length
  const maxPage = Math.max(1, Math.ceil(total / newPerPage))
  if (page.value > maxPage) {
    page.value = maxPage
  }
}, { immediate: true, deep: true })
</script>
