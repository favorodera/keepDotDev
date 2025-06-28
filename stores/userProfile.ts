import type { RealtimeChannel } from '@supabase/supabase-js'

const userProfileStore = defineStore('userProfile', () => {
  const client = useSupabaseClient()

  const user = useSupabaseUser()
  const realtimeChannel = ref<RealtimeChannel | null>(null)
  

  function subscribe() {
    if (!user.value) return

    unsubscribe()

    realtimeChannel.value = client.channel('public:users-profile')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.value.id}`,
      }, () => refreshNuxtData('user-profile'))
      .subscribe()
  }

  function unsubscribe() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  return {
    user,
    subscribe,
    unsubscribe,
  }
})

export default userProfileStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userProfileStore, import.meta.hot))
}
