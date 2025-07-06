<template>

  <main
    class="flex flex-auto p-4 w-full items-start"
  >

    <div class="flex items-center gap-2 justify-between w-full">
      <UButton
        icon="lucide:chevron-left"
        variant="ghost"
        color="neutral"
        size="sm"
        label="Back"
        to="/library"
      />

      <UButton
        icon="lucide:plus"
        label="Add item"
        size="sm"
        variant="soft"
        color="neutral"
      />

    </div>

  </main>

</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
