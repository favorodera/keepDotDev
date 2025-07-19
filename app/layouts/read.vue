<template>
  <main class="flex flex-col w-full min-h-dvh">

    <section
      id="read-catalog-teleport-holder"
      class="grid lg:grid-cols-10 grid-cols-1 flex-auto mx-auto w-full transition-all duration-300 max-w-8xl"
    >
  
      <ReadSideBar />

      <section class="flex flex-col w-full col-span-6">

        <ReadNav />

        <slot />

      </section>
      
    </section>

  </main>
</template>

<script setup lang="ts">
const library = libraryStore()

await callOnce('get-library', () => library.getLibrary())

onMounted(() => library.realtimeOn())

onUnmounted(() => library.realtimeOff())
</script>
