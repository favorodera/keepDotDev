<template>
  <main class="flex flex-col items-center justify-center flex-auto">

    <LibraryShelves />

  </main>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const { getShelves } = shelvesStore()
const { getShelvesItems } = shelvesItemsStore()

await callOnce('all-shelves', () => getShelves())
await callOnce('all-shelves-items', () => getShelvesItems())


definePageMeta({
  layout: 'authenticated',
  colorMode: 'dark',
})

useSeoMeta({
  title: () => {
    if (user.value) {
      return `| ${user.value.user_metadata.full_name} | Library`
    }
    return '| Library'
  },
})



</script>

