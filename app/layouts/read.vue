<template>
  <main class="flex flex-col w-full min-h-dvh">

    <section
      id="read-catalog-teleport-holder"
      class="grid md:grid-cols-[16rem_1fr_16rem] flex-auto mx-auto w-full transition-all duration-300 max-w-8xl"
    >
  
      <ReadSideBar />

      <section class="flex flex-col w-full">

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
