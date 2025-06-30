import type { RealtimeChannel } from '@supabase/supabase-js'
import type { AsyncSuccess, DatabaseUser, DynamicFetchError } from '~/utils/types/app'

export const useUserProfileStore = defineStore('userProfile', () => {
  const client = useSupabaseClient()
  const realtimeChannel = ref<RealtimeChannel | null>(null)

  const {
    data: userProfileData,
    status: userProfileFetchStatus,
    error: userProfileFetchError,
    execute: getUserProfile,
  } = useDynamicFetch<AsyncSuccess<{ user: DatabaseUser }>, DynamicFetchError>('/api/user-profile', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
    immediate: false,
  })

  const userProfile = computed(() => userProfileData.value?.user)
  
  function subscribeToRealtime(userId: string) {

    unsubscribeFromRealtime()

    realtimeChannel.value = client.channel('public:users-profile')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      }, () => getUserProfile())
      .subscribe()
  }

  function unsubscribeFromRealtime() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  const isThisDataRefresh = computed(() => !!userProfile.value && userProfileFetchStatus.value === 'pending')

  return {
    userProfile,
    userProfileFetchStatus,
    userProfileFetchError,
    isThisDataRefresh,
    subscribeToRealtime,
    unsubscribeFromRealtime,
    getUserProfile,
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserProfileStore, import.meta.hot))
}
