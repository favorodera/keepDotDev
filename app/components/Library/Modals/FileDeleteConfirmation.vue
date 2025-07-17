<template>

  <UModal
    :title="`Delete File`"
    :dismissible="false"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      Delete <span class="font-bold">{{ file.name }}</span> file
    </template>

    <template #body>
      <p>Are you sure you want to delete this file?</p>
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
import type { File } from '~~/shared/types/app'

const props = defineProps<{
  file: Pick<File, 'name' | 'id' | 'folder_id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const { execute, status } = useDollarFetch<AsyncSuccess, AsyncError>('/api/library/delete-file', {
  $fetch: {
    method: 'DELETE',
    query: {
      fileId: props.file.id,
      folderId: props.file.folder_id,
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
        title: error.data?.message || 'Error deleting item',
        color: 'error',
        icon: 'lucide:circle-x',
      })
    },
  },
}, false)
</script>
