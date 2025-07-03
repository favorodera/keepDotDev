<template>
  <main class="flex overflow-hidden flex-col flex-auto justify-center items-center">

    <LibraryShelves />

  </main>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()

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
  shelvesStore().subscribeToRealtime()
})

onUnmounted(() => {
  shelvesStore().unsubscribeFromRealtime()
})


</script>

