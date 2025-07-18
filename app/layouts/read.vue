<template>
  <main class="flex flex-col w-full min-h-dvh">

    <section
      class="grid relative flex-auto mx-auto w-full transition-all duration-300 max-w-8xl"
      :class="'md:grid-cols-[16rem_1fr_16rem]'"
    >
      <ReadSideBar />

      <section class="flex flex-col w-full">
        <ReadNav />
        <slot />
      </section>

      <aside class="hidden sticky top-0 z-20 flex-col w-64 md:flex min-w-64 h-dvh min-h-dvh border-x border-default">

        <p class="border-b border-default px-4 py-7">
          On this page
        </p>

        <MdCatalog
          scroll-element="html"
          editor-id="keepdotdev-markdown-preview"
          class="p-2"
          :md-heading-id="(text) => mdHeadingId(text)"
          :offset-top="500"
          @on-click="(event, toc:TocItem) => router.push({ hash: `#${mdHeadingId(toc.text)}` })"
        />
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import { MdCatalog } from 'md-editor-v3'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'

const router = useRouter()

const library = libraryStore()

await callOnce('get-library', () => library.getLibrary())

onMounted(() => library.realtimeOn())

onUnmounted(() => library.realtimeOff())
</script>
