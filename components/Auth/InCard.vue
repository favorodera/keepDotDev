<template>

  <section
    aria-label="Authentication"
    class="flex-auto px-4 py-24 w-full z-2 md:px-6 md:py-32"
  >

    <div
      role="main"
      class="flex flex-col gap-8 justify-center items-center px-4 py-8 mx-auto w-full max-w-lg rounded-lg border border-default"
    >

      <header
        role="banner"
        class="flex gap-1 justify-center items-center pb-4 w-full border-b border-neutral-800"
      >

        <UIcon
          name="lucide:shield"
          class="size-6"
          aria-hidden="true"
        />

        <h1
          id="auth-title"
          class="text-xl font-semibold leading-none text-center"
        >
          Authentication
        </h1>

      </header>

      <div
        role="group"
        aria-labelledby="auth-title"
        class="flex flex-col gap-2 w-full"
      >

        <UButton
          v-for="provider in oAuthProviders"
          :key="provider.name"
          :label="provider.name"
          :icon="provider.icon"
          loading-auto
          block
          square
          variant="outline"
          @click="provider.action()"
        />

      </div>

    </div>

  </section>

</template>


<script setup lang="ts">
const { signInWithOAuth } = useAuth()

const oAuthProviders = [
  {
    name: 'Login with GitHub',
    icon: 'lucide:github',
    action: async () => await signInWithOAuth('github'),
  },
]
</script>


