<template>

  <main class="flex flex-col items-center justify-center flex-auto">

    <LibraryShelfItems />

  </main>

</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const { getShelvesItems, subscribeToRealtime, unsubscribeFromRealtime } = shelvesItemsStore()

definePageMeta({
  layout: 'authenticated',
  colorMode: 'dark',
})

useSeoMeta({
  title: () => {
    if (user.value) {
      return `| ${user.value.user_metadata.full_name} | Shelf`
    }
    return '| Shelf'
  },
})

await callOnce('all-shelves-items', () => getShelvesItems())

onMounted(() => {
  subscribeToRealtime()
})

onUnmounted(() => {
  unsubscribeFromRealtime()
})
</script>
