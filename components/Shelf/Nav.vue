<template>
  <nav class="sticky -top-1 z-10 p-4 w-full mx-auto max-w-8xl border-b border-neutral-800 md:p-6 bg-default">
  
    <ul class="flex justify-end items-center mx-auto w-full max-w-8xl">

      <li>
        <UAvatar
          v-if="userProfile"
          :src="userProfile.avatar_url"
          :alt="userProfile.full_name"
          size="lg"
        />

        <USkeleton
          v-else-if="userProfileStatus === 'pending' && !isRefresh"
          class="w-9 h-9 rounded-full"
        />
      </li>
  
    </ul>
  
  </nav>
  
</template>


<script lang="ts" setup>
const { userProfile, isRefresh, userProfileStatus } = storeToRefs(useUserProfileStore())
</script>
  
