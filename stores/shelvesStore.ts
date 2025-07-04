import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Shelf, AsyncSuccess, DynamicFetchError } from '~/utils/types/app'


const shelvesStore = defineStore('all-shelves', () => {
  const client = useSupabaseClient()
  const realtimeChannel = ref<RealtimeChannel | null>(null)
  const shelves = useState<Shelf[]>('all-shelves', () => [])
  const user = useSupabaseUser()
  
  const {
    status: shelvesFetchStatus,
    error: shelvesFetchError,
    execute: getShelves,
  } = useDollarFetch<AsyncSuccess<{ shelves: Shelf[] }>, DynamicFetchError>('/api/shelves/all', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
    onResponse({ response }) {
      if (response.ok) {
        const responseShelves = response._data.shelves as Shelf[]
        shelves.value = responseShelves.sort((shelfA, shelfB) => {
          if (shelfA.starred && !shelfB.starred) return -1
          if (!shelfA.starred && shelfB.starred) return 1
          return new Date(shelfB.updated_at).getTime() - new Date(shelfA.updated_at).getTime()
        })
      }
    },
  }, false)


  function unsubscribeFromRealtime() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  function subscribeToRealtime() {
    realtimeChannel.value = client.channel('public:shelves')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shelves',
        filter: `owner_id=eq.${user.value?.id}`,
      }, () => getShelves())
      .subscribe()
  }

  const isThisDataRefresh = computed(() => !!shelves.value && shelvesFetchStatus.value === 'pending')

  return {
    shelves,
    shelvesFetchStatus,
    shelvesFetchError,
    getShelves,
    subscribeToRealtime,
    unsubscribeFromRealtime,
    isThisDataRefresh,
  }
})

export default shelvesStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(shelvesStore, import.meta.hot))
}
  
