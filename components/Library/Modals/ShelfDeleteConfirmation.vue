<template>

  <UModal
    :title="`Delete Shelf`"
    :dismissible="false"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      Delete <span class="font-bold">{{ shelf.name }}</span> shelf
    </template>

    <template #body>
      <p>Are you sure you want to delete this shelf?</p>
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
  shelf: Pick<Shelf, 'name' | 'id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const { execute, data, status, error } = useDollarFetch<AsyncSuccess, AsyncError>('/api/shelves/delete', {
  method: 'DELETE',
  query: {
    shelfId: props.shelf.id,
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
      title: newError.data?.message || 'Error deleting shelf',
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
}, { immediate: true })
</script>
