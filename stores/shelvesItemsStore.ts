import type { RealtimeChannel } from '@supabase/supabase-js'

const shelvesItemsStore = defineStore('shelvesItems', () => {

  const shelvesItems = useState<ShelfItem[]>('all-shelves-items', () => [])
  const user = useSupabaseUser()
  const computedTrigger = ref(0)
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
    const _ = computedTrigger.value
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
          case 'UPDATE':
          {
            const updatedShelfItem = payload.new as ShelfItem
            const index = shelvesItems.value.findIndex(item => item.id === updatedShelfItem.id)
            if (index !== -1) {
              shelvesItems.value.splice(index, 1, updatedShelfItem)
              computedTrigger.value++
            }
            break
          }
          case 'INSERT':
          {
            const newShelfItem = payload.new as ShelfItem
            shelvesItems.value.push(newShelfItem)
            computedTrigger.value++
            break
          }
          case 'DELETE':
          {
            const deletedShelfItem = payload.old as ShelfItem
            const index = shelvesItems.value.findIndex(item => item.id === deletedShelfItem.id)
            if (index !== -1) {
              shelvesItems.value.splice(index, 1)
              computedTrigger.value++
            }
            break
          }
        }
      })
      .subscribe()
  }

  function getShelfItemsByShelfId(shelfId: number) {
    return [...shelvesItems.value].filter(item => item.shelf_id === shelfId)
  }

  function getShelfItemById(shelfItemId: number) {
    return [...shelvesItems.value].find(item => item.id === shelfItemId)
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
