import type { RealtimeChannel } from '@supabase/supabase-js'

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
        shelves.value = response._data.shelves as Shelf[]
      }
    },
  }, false)


  const sortedShelves = computed(() => {
    return [...shelves.value].sort((shelfA, shelfB) => {
      if (shelfA.starred && !shelfB.starred) return -1
      if (!shelfA.starred && shelfB.starred) return 1
      return new Date(shelfB.updated_at).getTime() - new Date(shelfA.updated_at).getTime()
    })
  })

  function unsubscribeFromRealtime() {
    if (realtimeChannel.value) {
      realtimeChannel.value.unsubscribe()
      realtimeChannel.value = null
    }
  }

  function subscribeToRealtime() {
    if (!user.value) return

    realtimeChannel.value = client.channel('public:shelves')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shelves',
        filter: `owner_id=eq.${user.value.id}`,
      }, (payload) => {
        switch (payload.eventType) {
          case 'UPDATE': {
            const updatedShelf = payload.new as Shelf
            shelves.value = shelves.value.map(shelf =>
              shelf.id === updatedShelf.id ? updatedShelf : shelf,
            )
            break
          }
          case 'INSERT': {
            const newShelf = payload.new as Shelf
            shelves.value = [...shelves.value, newShelf]
            break
          }
          case 'DELETE': {
            const deletedShelf = payload.old as Shelf
            shelves.value = shelves.value.filter(shelf => shelf.id !== deletedShelf.id)
            break
          }
        }
      })
      .subscribe()
  }

  return {
    shelves: sortedShelves,
    shelvesFetchStatus,
    shelvesFetchError,
    getShelves,
    subscribeToRealtime,
    unsubscribeFromRealtime,
  }
})

export default shelvesStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(shelvesStore, import.meta.hot))
}
  
