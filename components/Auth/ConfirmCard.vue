<template>

  <section class="flex-auto px-4 py-24 w-full z-2 md:px-6 md:py-32">
  
    <div class="flex flex-col gap-8 justify-center items-center px-4 py-8 mx-auto w-full max-w-lg rounded-lg border border-neutral-800">
  
  
      <header class="flex items-center gap-1">
  
        <UIcon
          name="lucide:shield"
          class="size-6"
        />
  
        <h1 class="text-xl leading-none font-semibold text-center">
          Authentication
        </h1>
  
      </header>
  
  
    </div>
      
  </section>
  
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(user, (newUser) => {
  if (newUser) {
    const path = redirectInfo.pluck()

    return navigateTo(path || '/')
  }
}, { immediate: true })
</script>
  
  
  
