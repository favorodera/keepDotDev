<template>
  <main class="flex flex-col min-h-screen">

    <section class="flex w-full flex-auto max-w-8xl mx-auto">

      <ShelfSideBar ref="sideBar" />

      <ShelfNav>
      
      </ShelfNav>

    </section>

  </main>
</template>

<script lang="ts" setup>
const toast = useToast()

const sideBar = useTemplateRef('sideBar')

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

