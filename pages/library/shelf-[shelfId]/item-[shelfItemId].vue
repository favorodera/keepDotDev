<template>

  <main class="flex flex-col flex-auto justify-center items-center">
  
    <LibraryNewAndEditShelfItem />
  
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
      return `| ${user.value.user_metadata.full_name} | New Shelf Item`
    }
    return '| New Shelf Item'
  },
})
</script>
  
  <style scoped>
  
  </style>
  
