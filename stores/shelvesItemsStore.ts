import type { RealtimeChannel } from '@supabase/supabase-js'

const shelvesItemsStore = defineStore('shelvesItems', () => {

  const shelvesItems = useState<ShelfItem[]>('all-shelves-items', () => [])
  const user = useSupabaseUser()
  const realtimeChannel = ref<RealtimeChannel | null>(null)
  const client = useSupabaseClient()

  const {
    status: shelvesItemsFetchStatus,
    error: shelvesItemsFetchError,
    execute: getShelvesItems,
  } = useDollarFetch<AsyncSuccess<{ shelvesItems: ShelfItem[] }>, DynamicFetchError>('/api/shelves-items/all', {
    method: 'GET',
    headers: useRequestHeaders(['cookie']),
    onResponse({ response }) {
      if (response.ok) {
        shelvesItems.value = response._data.shelvesItems as ShelfItem[]
      }
    },
  }, false)


  const sortedShelvesItems = computed(() => {
    return [...shelvesItems.value].sort((itemA, itemB) => {
      return new Date(itemB.updated_at).getTime() - new Date(itemA.updated_at).getTime()
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

    realtimeChannel.value = client.channel('public:shelves_items')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shelves_items',
        filter: `owner_id=eq.${user.value.id}`,
      }, (payload) => {
        switch (payload.eventType) {
          case 'UPDATE': {
            const updatedShelfItem = payload.new as ShelfItem
            shelvesItems.value = shelvesItems.value.map(item =>
              item.id === updatedShelfItem.id ? updatedShelfItem : item,
            )
            break
          }
          case 'INSERT': {
            const newShelfItem = payload.new as ShelfItem
            shelvesItems.value = [...shelvesItems.value, newShelfItem]
            break
          }
          case 'DELETE': {
            const deletedShelfItem = payload.old as ShelfItem
            shelvesItems.value = shelvesItems.value.filter(item => item.id !== deletedShelfItem.id)
            break
          }
        }
      })
      .subscribe()
  }

  function getShelfItemsByShelfId(shelfId: number) {
    return sortedShelvesItems.value.filter(item => item.shelf_id === shelfId)
  }

  function getShelfItemById(shelfItemId: number) {
    return sortedShelvesItems.value.find(item => item.id === shelfItemId)
  }

  return {
    shelvesItems: sortedShelvesItems,
    shelvesItemsFetchStatus,
    shelvesItemsFetchError,
    getShelvesItems,
    subscribeToRealtime,
    unsubscribeFromRealtime,
    getShelfItemsByShelfId,
    getShelfItemById,
  }
})

export default shelvesItemsStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(shelvesItemsStore, import.meta.hot))
}
