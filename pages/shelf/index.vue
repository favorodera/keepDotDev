<template>
  <main class="flex flex-col min-h-screen">

    <ShelfNav />

  </main>
</template>

<script lang="ts" setup>
const { getUserProfile } = useUserProfileStore()

await useAsyncData('user-profile', () => getUserProfile(), { server: false })

</script>

