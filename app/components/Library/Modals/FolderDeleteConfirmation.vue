<template>

  <UModal
    :title="`Delete Folder`"
    :dismissible="false"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      Delete <span class="font-bold">{{ folder.name }}</span> folder
    </template>

    <template #body>
      <p>Are you sure you want to delete this folder?</p>
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
  folder: Pick<Folder, 'name' | 'id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const { execute, status } = useDollarFetch<AsyncSuccess, AsyncError>('/api/library/delete-folder', {
  $fetch: {
    method: 'DELETE',
    query: {
      folderId: props.folder.id,
    },
  },
  hooks: {
    onSuccess(data) {
      emit('close', false)
      toast.add({
        title: data.message,
        color: 'success',
        icon: 'lucide:circle-check',
      })
    },
    onError(error) {
      toast.add({
        title: error.data?.message || 'Error deleting folder',
        color: 'error',
        icon: 'lucide:circle-x',
      })
    },
  },
}, false)
</script>
