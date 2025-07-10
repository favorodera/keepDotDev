<template>

  <main class="flex flex-col items-center justify-center flex-auto max-h-dvh">
  
    <LibraryShelfItem />
  
  </main>
  
</template>
  
<script lang="ts" setup>
const user = useSupabaseUser()
const { getShelvesItems } = shelvesItemsStore()
  

definePageMeta({
  layout: 'authenticated',
  colorMode: 'dark',
})
  
useSeoMeta({
  title: () => {
    if (user.value) {
      return `| ${user.value.user_metadata.full_name} | Shelf Item`
    }
    return '| Shelf Item'
  },
})


await callOnce('all-shelves-items', () => getShelvesItems())
</script>
  
