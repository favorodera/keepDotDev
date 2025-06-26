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
        class="flex flex-col gap-4 p-4 rounded-lg bg-primary/5"
        :aria-label="feature.title"
      >
    
        <div class="flex justify-center items-center p-2 rounded-lg bg-primary/5 w-fit">
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

          <p class="text-base text-neutral-400">
            {{ feature.description }}
          </p>
        
        </div>

        

      </div>

    </div>

  </section>

</template>

<script lang="ts" setup>
const features = ref([
  { title: 'Easy to use', description: 'Easily create and edit code snippets with an intuitive and user-friendly interface, designed for efficiency.', icon: 'lucide:rocket' },
  { title: 'Share and Collaborate', description: 'Effortlessly share your code snippets and collaborate with others in real time, making teamwork seamless.', icon: 'lucide:share-2' },
  { title: 'Customizable', description: 'Customize your code snippets with your own tags, categories, and folders to keep everything organized just the way you like.', icon: 'lucide:palette' },
  { title: 'Searchable', description: 'Quickly search your code snippets by title, description, and tags, so you can always find what you need when you need it.', icon: 'lucide:search' },
])
</script>
