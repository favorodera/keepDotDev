<template>
  <main>

    <ShelfNav :user-metadata="userProfileResponse?.user.metadata" />

  </main>
</template>

<script lang="ts">
import userProfileStore from '~/stores/userProfile'
import type { AsyncSuccess, DatabaseUser, AsyncError } from '~/utils/types'
</script>

<script lang="ts" setup>
const toast = useToast()
const { subscribe: subscribeUserProfile, unsubscribe: unsubscribeUserProfile } = userProfileStore()

const { data: userProfileResponse, error: userProfileError, status: userProfileStatus } = await useAsyncData<
  AsyncSuccess<{ user: DatabaseUser }>,
  AsyncError
>(
  'user-profile',
  () => $fetch('/api/user-profile', { method: 'GET', headers: useRequestHeaders(['cookie']) }),
)

watch([userProfileError, userProfileStatus], ([newError, newStatus]) => {

  if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message,
      color: 'error',
    })
  }

}, { immediate: true, deep: true })

onMounted(() => {
  subscribeUserProfile()
})

onUnmounted(() => {
  unsubscribeUserProfile()
})

</script>

