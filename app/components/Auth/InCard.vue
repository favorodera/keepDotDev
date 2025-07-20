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
        class="flex flex-col gap-6 justify-center items-center pb-4 w-full border-b border-default"
      >

        <div class="flex gap-1 justify-center items-center p-2 rounded-lg bg-elevated">
          <Logo
            hide-text
            icon-class="size-8"
          />
        </div>

        <h1
          id="auth-title"
          class="text-lg font-medium text-center"
        >
          Sign in to your account
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
          :label="`Sign in with ${provider.name}`"
          :icon="provider.icon"
          loading-auto
          block
          square
          @click="provider.action()"
        />

      </div>

    </div>

  </section>

</template>


<script setup lang="ts">
const { signInWithOAuth } = authUtils()
const user = useSupabaseUser()

const oAuthProviders = [
  {
    name: 'GitHub',
    icon: 'lucide:github',
    action: async () => await signInWithOAuth('github'),
  },
]

watch(user, (newUser) => {
  if (newUser) {
    return navigateTo('auth/confirm')
  }
}, { immediate: true, deep: true })
</script>


