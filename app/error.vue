<template>

  <main
    class="flex flex-col min-h-dvh"
  >

    <Title>KeepDotDev | Error | {{ error.statusCode }}</Title>


    <section class="flex flex-col flex-auto justify-center items-center mx-auto w-full max-w-8xl p-4">


      <div class="flex items-center p-4 w-full max-w-sm flex-col gap-4 rounded-md border border-default justify-center">

        <h1 class="text-xl">
          {{ error.statusCode }}
        </h1>

        <p class="text-lg break-all">
          {{ error.data.message || error.message }}
        </p>

        <div class="flex items-center gap-4  w-full">
          <UButton
            label="Go Back"
            icon="lucide:arrow-left"
            block
            size="sm"
            variant="soft"
            @click="useRouter().back"
          />

          <UButton
            label="Go Home"
            icon="lucide:home"
            block
            size="sm"
            to="/"
          />
        </div>

      </div>

    </section>

  </main>

</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'


defineProps<{ error: NuxtError }>()
</script>
