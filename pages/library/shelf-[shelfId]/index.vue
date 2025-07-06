<template>

  <main class="flex flex-col flex-auto justify-center items-center">

    <LibraryShelf />

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
      return `| ${user.value.user_metadata.full_name} | Shelf`
    }
    return '| Shelf'
  },
})
</script>

<style scoped>

</style>
