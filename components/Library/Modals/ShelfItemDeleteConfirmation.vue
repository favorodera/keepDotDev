<template>

  <UModal
    :title="`Delete Shelf Item`"
    :dismissible="false"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      Delete <span class="font-bold">{{ shelfItem.name }}</span> shelf item
    </template>

    <template #body>
      <p>Are you sure you want to delete this item?</p>
      <p>This action cannot be undone.</p>
    </template>

    <template #footer>
      <UButton
        label="No"
        icon="lucide:circle-x"
        variant="soft"
        color="neutral"
        square
        :disabled="status === 'pending'"
        block
        size="lg"
        @click="emit('close', false)"
      />

      <UButton
        label="Yes"
        icon="lucide:circle-check"
        variant="soft"
        color="error"
        square
        :disabled="status === 'pending'"
        block
        :loading="status === 'pending'"
        size="lg"
        @click="execute()"
      />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const props = defineProps<{
  shelfItem: Pick<ShelfItem, 'name' | 'id' | 'shelf_id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const { execute, data, status, error } = useDollarFetch<AsyncSuccess, AsyncError>('/api/shelves-items/delete', {
  method: 'DELETE',
  query: {
    itemId: props.shelfItem.id,
    shelfId: props.shelfItem.shelf_id,
  },
}, false)

watch([data, status, error], ([newData, newStatus, newError]) => {
  if (newData && newStatus === 'success') {
    emit('close', false)
    toast.add({
      title: newData.message,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  }
  else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || 'Error deleting item',
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
}, { immediate: true })
</script>
