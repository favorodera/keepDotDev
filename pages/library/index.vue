<template>
  <main class="flex flex-col items-center justify-center flex-auto overflow-hidden">

    <LibraryShelves />

  </main>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const { getShelves, subscribeToRealtime, unsubscribeFromRealtime } = shelvesStore()

await callOnce('all-shelves', () => getShelves())

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

onMounted(() => {
  subscribeToRealtime()
})

onUnmounted(() => {
  unsubscribeFromRealtime()
})

</script>

