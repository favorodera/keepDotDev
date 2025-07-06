import type { RealtimeChannel } from '@supabase/supabase-js'

const shelvesItemsStore = defineStore('shelvesItems', () => {

  const shelfItems = useState<ShelfItem[]>('shelfItems', () => [])
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
        shelfItems.value = response._data.shelvesItems as ShelfItem[]
      }
    },
  }, false)

  const sortedShelfItems = computed(() => {
    const _ = computedTrigger.value
    return shelfItems.value.sort((itemA, itemB) => {
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

    realtimeChannel.value = client.channel('public:shelves-items')
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
            const index = shelfItems.value.findIndex(item => item.id === updatedShelfItem.id)
            if (index !== -1) {
              shelfItems.value.splice(index, 1, updatedShelfItem)
              computedTrigger.value++
            }
            break
          }
          case 'INSERT':
          {
            const newShelfItem = payload.new as ShelfItem
            shelfItems.value.push(newShelfItem)
            computedTrigger.value++
            break
          }
          case 'DELETE':
          {
            const deletedShelfItem = payload.old as ShelfItem
            const index = shelfItems.value.findIndex(item => item.id === deletedShelfItem.id)
            if (index !== -1) {
              shelfItems.value.splice(index, 1)
              computedTrigger.value++
            }
            break
          }
        }
      })
  }

  return {
    sortedShelfItems,
    shelvesItemsFetchStatus,
    shelvesItemsFetchError,
    getShelvesItems,
    subscribeToRealtime,
    unsubscribeFromRealtime,
  }
})

export default shelvesItemsStore

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(shelvesItemsStore, import.meta.hot))
}
