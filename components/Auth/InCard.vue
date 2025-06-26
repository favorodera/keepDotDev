<template>

  <section class="flex-auto px-4 py-8 w-full z-2 md:px-6 md:py-12">

    <div class="flex flex-col gap-8 justify-center items-center px-4 py-8 mx-auto w-full max-w-lg rounded-lg border border-neutral-800">

      <Logo />

      <h1 class="text-xl font-semibold text-center">
        Welcome to Keep.Dev
      </h1>


      <USeparator
        label="Continue with"
        size="md"
        type="dashed"
      />

      <div class="flex flex-col gap-2 w-full">

        
        <UButton
          v-for="provider in oAuthProviders"
          :key="provider.name"
          :label="provider.name"
          :icon="provider.icon"
          block
          square
          size="lg"
          variant="outline"
          @click="provider.action"
        />

      </div>

    </div>
    
  </section>

</template>


<script setup lang="ts">

const oAuthProviders = [
  {
    name: 'GitHub',
    icon: 'lucide:github',
    action: () => {},
  },
  
]

</script>



