<template>
  <main
    ref="pageRef"
    class="flex flex-col min-h-screen touch-none"
  >

    <section class="flex overflow-hidden relative flex-auto mx-auto w-full max-w-8xl">

      <ClientOnly>
        <ShelfSideBar ref="sidebarRef" />
      </ClientOnly>

      <ShelfNav />

    </section>

  </main>
</template>

<script lang="ts" setup>
const pageRef = useTemplateRef('pageRef')
const sidebarRef = useTemplateRef('sidebarRef')

const { toggleSidebar, isVisible, isExpanded } = useSideBar()
const toast = useToast()

const { lengthX } = useSwipe(pageRef, {
  passive: false,
  onSwipeEnd(event, direction) {
    if (!pageRef.value) return
    
    const threshold = pageRef.value.offsetWidth * 0.3
    const absLengthX = Math.abs(lengthX.value)
    
    if (absLengthX >= threshold) {
      if (direction === 'right' && !isVisible.value) {
        toggleSidebar()
      } else if (direction === 'left' && isVisible.value) {
        toggleSidebar()
      }
    }
  },
  threshold: 25,
})

onClickOutside(sidebarRef, () => {
  if (isVisible.value || isExpanded.value) {
    toggleSidebar()
  }
})


const { getUserProfile, subscribeToRealtime } = useUserProfileStore()
const { userProfile, userProfileFetchStatus, userProfileFetchError } = storeToRefs(useUserProfileStore())

await useLazyAsyncData('user-profile', () => getUserProfile())

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

