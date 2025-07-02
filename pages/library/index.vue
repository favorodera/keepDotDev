<template>
  <main class="flex overflow-hidden flex-col flex-auto justify-center items-center">

    <ShelfBody />

  </main>
</template>

<script lang="ts" setup>
const { userProfile } = storeToRefs(useUserProfileStore())
definePageMeta({
  layout: 'authenticated',
  colorMode: 'dark',
})

useSeoMeta({
  title: () => {
    if (userProfile.value) {
      return `| ${userProfile.value?.metadata.full_name} | Library`
    }
    return '| Library'
  },
})
</script>

