<template>

  <main class="flex flex-col w-full min-h-dvh">

    <ReadFile />
    
  </main>
  
</template>

<script lang="ts" setup>
const user = useSupabaseUser()

definePageMeta({
  colorMode: 'dark',
  layout: 'read',
})

useSeoMeta({
  title: () => user.value ? `| ${user.value.user_metadata.full_name}` : '',
})
</script>
