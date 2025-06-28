<template>
  <nav class="sticky -top-1 z-10 p-4 w-full border-b border-neutral-800 md:p-6 bg-default">
  
    <ul class="flex justify-between items-center mx-auto w-full max-w-8xl">
  
      <li>
        <Logo />
      </li>
  
  
      <li>
        <UAvatar
          v-if="userMetadata"
          :src="userMetadata.avatar_url"
          :alt="userMetadata.full_name"
          size="lg"
        />
      </li>
  
    </ul>
  
  </nav>
  
</template>

<script lang="ts" setup>
import type { DatabaseUser } from '~/utils/types'

defineProps<{
  userMetadata: DatabaseUser['metadata'] | undefined
}>()
</script>
  
