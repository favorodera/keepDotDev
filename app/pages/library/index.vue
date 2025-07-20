<template>
  <main class="flex flex-col items-center justify-center flex-auto">

    <LibraryFolders />

  </main>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()

definePageMeta({
  layout: 'library',
  colorMode: 'dark',
})

useSeoMeta({
  title: () => user.value ? `| ${user.value.user_metadata.full_name}` : '',
})

</script>

