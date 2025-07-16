<template>

  <main class="flex flex-col min-h-dvh">

    <section
      class="grid relative mx-auto w-full flex-auto max-w-8xl transition-all duration-300"
      :class="isOpen
        ? 'md:grid-cols-[16rem_1fr]'
        : 'md:grid-cols-[4rem_1fr]'"
    >

      <LibrarySideBar />

      <section class="flex flex-col">
        <LibraryNav />

        <slot />
      </section>

    </section>

  </main>


</template>

<script lang="ts" setup>
const { isOpen } = useSideBar()
</script>
