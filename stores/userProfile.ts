import type { RealtimeChannel } from '@supabase/supabase-js'
import type { AsyncSuccess, DatabaseUser, AsyncError } from '~/utils/types'
import { useDynamicFetch } from '#imports'

export const useUserProfileStore = defineStore('userProfile', () => {
  const client = useSupabaseClient()
  const toast = useToast()
  const realtimeChannel = ref<RealtimeChannel | null>(null)

  const {
    data: userProfileResponse,
    status: userProfileStatus,
    error: userProfileError,
    execute: getUserProfile,
  } = useDynamicFetch<AsyncSuccess<{ user: DatabaseUser }>, AsyncError>('/api/user-profile', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
    immediate: false,
  })

  const userProfile = computed(() => userProfileResponse.value?.user)
  
  function subscribe() {
    if (!userProfile.value) return

    unsubscribe()

    realtimeChannel.value = client.channel('public:users-profile')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userProfile.value.id}`,
      }, () => getUserProfile())
      .subscribe()
  }

  function unsubscribe() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  const isRefresh = computed(() => !!userProfile.value && userProfileStatus.value === 'pending')

  watch([userProfile, userProfileError, userProfileStatus], ([newUserProfile, newError, newStatus]) => {
    if (newUserProfile) subscribe()
    if (!newUserProfile) unsubscribe()

    if (newError && newStatus === 'error') {
      toast.add({
        title: newError.data?.message || 'Error fetching user profile',
        color: 'error',
        icon: 'lucide:alert-circle',
      })
    }
  }, { immediate: true, deep: true })

  return {
    userProfile,
    userProfileStatus,
    userProfileError,
    isRefresh,
    subscribe,
    unsubscribe,
    getUserProfile,
  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserProfileStore, import.meta.hot))
}
