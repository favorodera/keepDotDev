<template>

  <main class="flex flex-col min-h-dvh">

    <section
      class="grid relative mx-auto w-full flex-auto max-w-8xl transition-all duration-300"
      :class="sideBarRef?.isExpanded
        ? 'md:grid-cols-[16rem_1fr]'
        : 'md:grid-cols-[4rem_1fr]'"
    >

      <LibrarySideBar ref="sideBarRef" />

      <section class="flex flex-col">
        <LibraryNav />

        <slot />
      </section>

    </section>

  </main>


</template>

<script lang="ts" setup>
const library = libraryStore()
const sideBarRef = useTemplateRef('sideBarRef')

await callOnce('get-library', () => library.getLibrary())

onMounted(() => library.realtimeOn())

onUnmounted(() => library.realtimeOff())
</script>

