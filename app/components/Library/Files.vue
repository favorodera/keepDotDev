<template>

<main
    class="flex flex-col flex-auto gap-4 items-start p-4 w-full"
  >

  <template v-if="library.status === 'success' ">

<div class="flex gap-2 justify-between items-center w-full">
  <UButton
    icon="lucide:chevron-left"
    variant="outline"
    color="neutral"
    size="sm"
    to="/library"
  />

  <div class="flex gap-2 items-center">
    <UPopover
      v-model:open="isPopoverOpen"
      arrow
      :content="{ align: 'end' }"
      :ui="{ content: 'bg-default p-2 max-w-35' }"
    >
      <UButton
        icon="lucide:layout-list"
        size="sm"
        variant="soft"
        color="neutral"
      />
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
          />
        </form>
      </template>
    </UPopover>

    <UButton
      icon="lucide:bot"
      size="sm"
      variant="soft"
      color="neutral"
    />

    <UButton
      icon="lucide:book-open"
      size="sm"
      variant="soft"
      color="neutral"
    />

    
    <UButton
      icon="lucide:plus"
      size="sm"
      variant="soft"
      color="neutral"
    />

  </div>
</div>

</template>

</main>

</template>

<script lang="ts" setup>
const library = libraryStore()
const user = useSupabaseUser()
const auth = useAuth()
const routeParams = useRoute().params
const isPopoverOpen = ref(false)


const folder = computed(()=>library.getFolderById(Number(routeParams.folder)))

</script>