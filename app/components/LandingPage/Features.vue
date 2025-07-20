<template>

  <section
    aria-label="Features"
    class="px-4 py-8 w-full z-2 md:px-6 md:py-12"
  >

    <div
      class="grid grid-cols-1 gap-4 mx-auto w-full md:grid-cols-2 lg:grid-cols-4 max-w-8xl md:gap-8"
    >

      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex flex-col gap-4 p-4 rounded-lg bg-elevated"
        :aria-label="feature.title"
      >
    
        <div class="flex justify-center items-center p-2 rounded-lg bg-default/40 w-fit">
          <UIcon
            :name="feature.icon"
            class="size-5"
          />
        </div>

        <div
          class="flex flex-col gap-2"
        >

          <h2 class="text-lg font-medium">
            {{ feature.title }}
          </h2>

          <p class="text-base text-muted">
            {{ feature.description }}
          </p>
        
        </div>

        

      </div>

    </div>

  </section>

</template>

<script lang="ts" setup>
const features = ref([
  {
    title: 'Easy to use',
    description: 'Easily create and edit documentations with an intuitive and user-friendly interface, designed for efficiency.',
    icon: 'lucide:rocket',
  },
  { title: 'Searchable',
    description: 'Quickly search your code and documents by title and description so you can always find what you need when you need it.',
    icon: 'lucide:search',
  },
  {
    title: 'Markdown-powered',
    description: 'Write documentation in Markdown with advanced editing and real-time preview for a seamless writing experience.',
    icon: 'lucide:file-text',
  },
  {
    title: 'AI-powered',
    description: 'Leverage AI assistance to interact with your code and documents, boosting your productivity and learning.',
    icon: 'lucide:bot',
  },
])
</script>
