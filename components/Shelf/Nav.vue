<template>
  <nav class="sticky -top-1 z-10 p-4 w-full bg-default">
  
    <ul class="flex justify-end items-center mx-auto w-full max-w-8xl">

      <li>
        <UAvatar
          v-if="userProfile && userProfileFetchStatus === 'success'"
          :src="userProfile.metadata.avatar_url"
          :alt="userProfile.metadata.full_name"
          size="md"
        />

        <USkeleton
          v-else-if="userProfileFetchStatus === 'pending' && !isThisDataRefresh"
          class="w-9 h-9 rounded-full"
        />
      </li>
  
    </ul>
  
  </nav>
  
</template>


<script lang="ts" setup>
const { userProfile, isThisDataRefresh, userProfileFetchStatus } = storeToRefs(useUserProfileStore())
</script>
  
