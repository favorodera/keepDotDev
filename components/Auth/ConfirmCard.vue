<template>

  <section class="flex-auto px-4 py-24 w-full z-2 md:px-6 md:py-32">
  
    <div class="flex flex-col gap-8 justify-center items-center px-4 py-8 mx-auto w-full max-w-lg rounded-lg border border-neutral-800">
  
  
      <header class="flex gap-1 justify-center items-center pb-4 w-full border-b border-neutral-800">
  
        <UIcon
          name="lucide:shield"
          class="size-6"
        />
  
        <h1 class="text-xl font-semibold leading-none text-center">
          Authentication
        </h1>
  
      </header>

      <div
        v-if="!error.name"
        class="flex flex-col gap-4 justify-center items-center w-full"
      >

        <UIcon
          :name="isUserAvailable ? 'lucide:check-circle':'lucide:loader'"
          :class="{
            'animate-spin text-neutral-400': !isUserAvailable,
            'text-primary': isUserAvailable,
            'size-16': true,
          }"
        />

        <p class="text-sm text-center text-neutral-400">
          {{ isUserAvailable ? 'Authentication successful!' : 'Confirming authentication...' }}
        </p>

      </div>

      <UAlert
        v-if="error.name"
        :title="error.name"
        :description="error.description"
        color="neutral"
        icon="lucide:alert-circle"
        variant="subtle"
      />
  
  
    </div>
      
  </section>
  
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

const routeQuery = useRoute().query

const toast = useToast()

const error = computed(() => {
  return {
    name: routeQuery.error as string,
    description: routeQuery.error_description as string,
    code: routeQuery.error_code as string,
  }
})

const isUserAvailable = ref(false)

watch([user, routeQuery], ([newUser, newRouteQueryResponse]) => {
  if (newUser) {
    const path = redirectInfo.pluck()

    isUserAvailable.value = true

    return navigateTo(path || '/shelf')
  }

  if (newRouteQueryResponse.error) {
    isUserAvailable.value = false

    toast.add({
      title: 'Authentication failed',
      description: error.value.description,
      color: 'error',
    })
  }
}, { deep: true })
</script>
  
  
  
