<template>

  <main
    ref="pageRef"
    class="flex flex-col min-h-screen touch-none"
  >

    <section class="flex relative flex-auto mx-auto w-full max-w-8xl">

      <ClientOnly fallback-tag="aside">
        <LibrarySideBar />

        <template #fallback>
          <aside class="hidden flex-col flex-auto w-full transition-all max-w-16 border-x border-default bg-default md:relative h-dvh md:flex" />
        </template>
        
      </ClientOnly>

      <section class="flex flex-col flex-auto">
        <LibraryNav />

        <slot />
      </section>

    </section>

  </main>


</template>

<script lang="ts" setup>
const pageRef = useTemplateRef('pageRef')

const { toggleSidebar, isVisible } = useSideBar()

const { lengthX } = useSwipe(pageRef, {
  passive: false,
  onSwipeEnd(event, direction) {
    if (!pageRef.value) return
    
    const threshold = pageRef.value.offsetWidth * 0.3
    const absLengthX = Math.abs(lengthX.value)
    
    if (absLengthX >= threshold) {
      if (direction === 'right' && !isVisible.value) {
        toggleSidebar()
      } else if (direction === 'left' && isVisible.value) {
        toggleSidebar()
      }
    }
  },
  threshold: 25,
})
</script>
