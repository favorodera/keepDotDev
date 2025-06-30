<template>
  <main class="flex flex-col min-h-screen">

    <ShelfNav />

  </main>
</template>

<script lang="ts" setup>
const toast = useToast()

const { getUserProfile, subscribeToRealtime } = useUserProfileStore()
const { userProfile, userProfileFetchStatus, userProfileFetchError } = storeToRefs(useUserProfileStore())

await useAsyncData('user-profile', () => getUserProfile(), { server: false })

watch([userProfile, userProfileFetchStatus, userProfileFetchError], ([newUserProfile, newUserProfileFetchStatus, newUserProfileFetchError]) => {
  if (newUserProfile && newUserProfileFetchStatus === 'success') {
    subscribeToRealtime(newUserProfile.id)
  }

  if (newUserProfileFetchError && newUserProfileFetchStatus === 'error') {
    toast.add({
      title: newUserProfileFetchError.data?.message || 'Error fetching profile data',
      color: 'error',
      icon: 'lucide:alert-circle',
    })
  }


}, { immediate: true, deep: true })

</script>

