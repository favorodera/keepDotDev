<template>

  <section
    aria-label="Authentication Confirmation"
    class="flex-auto px-4 py-24 w-full z-2 md:px-6 md:py-32"
  >
  
    <div
      role="main"
      class="flex flex-col gap-8 justify-center items-center px-4 py-8 mx-auto w-full max-w-lg rounded-lg border border-neutral-800"
    >
  
  
      <header
        role="banner"
        class="flex gap-1 justify-center items-center pb-4 w-full border-b border-neutral-800"
      >
  
        <UIcon
          name="lucide:shield"
          class="size-6"
        />
  
        <h1
          id="auth-confirmation-title"
          class="text-xl font-semibold leading-none text-center"
        >
          Authentication
        </h1>
  
      </header>

      <div
        v-if="!error.name"
        role="group"
        aria-labelledby="auth-confirmation-title"
        class="flex flex-col gap-4 justify-center items-center w-full"
      >

        <UIcon
          :name="user ? 'lucide:check-circle':'lucide:loader'"
          :class="{
            'animate-spin text-neutral-400': !user,
            'text-primary': user,
            'size-16': true,
          }"
        />

        <p class="text-sm text-center text-neutral-400">
          {{ user ? 'Authentication successful!' : 'Confirming authentication...' }}
        </p>

      </div>

      <UAlert
        v-if="error.name"
        :title="formatUnderScore(error.name)"
        :description="error.description"
        color="neutral"
        icon="lucide:alert-circle"
        variant="subtle"
      />
  
    </div>
      
  </section>
  
</template>

<script lang="ts" setup>
const route = useRoute()
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()
const toast = useToast()

const error = computed(() => ({
  name: route.query.error as string,
  description: route.query.error_description as string,
  code: route.query.error_code as string,
}))

watch(
  [user, () => route.query.error],
  ([newUser, newError]) => {
    if (newError) {
      toast.add({
        description: error.value.description,
        color: 'error',
        icon: 'lucide:alert-circle',
      })
      return
    }

    if (newUser && !error.value.name) {
      const path = redirectInfo.pluck()
      return navigateTo(path || '/shelf')
    }
  },
  { immediate: true },
)
</script>
  
  
  
