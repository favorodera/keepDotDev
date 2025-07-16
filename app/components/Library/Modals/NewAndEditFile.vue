<template>
  <UModal
    :title="shouldUpdate ? 'Edit File' : 'New File'"
    :dismissible="false"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >
    <template #description>
      <span v-if="shouldUpdate">
        Edit <span class="font-bold">{{ props.file.name }}</span> file
      </span>
      <span v-else>
        Create a new file
      </span>
    </template>
    
    <template #body>
      <UForm
        id="new-and-edit-file-form"
        :state
        :schema
        class="space-y-4"
        @submit="execute({ $fetch: { body: whatToSend } })"
      >
        <UFormField
          required
          name="name"
          label="Name"
          description="The name of the file"
        >
          <UInput
            v-model="state.name"
            :disabled="status === 'pending'"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter file name"
            size="lg"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        variant="outline"
        square
        :disabled="status === 'pending'"
        block
        size="lg"
        @click="emit('close', false)"
      />
      <UButton
        :label="shouldUpdate ? 'Update' : 'Create'"
        type="submit"
        form="new-and-edit-file-form"
        :loading="status === 'pending'"
        :disabled="status === 'pending' || (shouldUpdate && !isNewStateDifferentFromOldState)"
        color="primary"
        square
        block
        size="lg"
      />
    </template>

  </UModal>
</template>

<script lang="ts" setup>
import z from 'zod'

const props = defineProps<{
  file: {
    name?: string
    fileId?: number
    folderId: number
  }
}>()

const shouldUpdate = computed(() => {
  return !!props.file.name && !!props.file.fileId
})

const { execute, status } = useDollarFetch<AsyncSuccess, AsyncError>(
  shouldUpdate.value ? '/api/library/edit-file-name' : '/api/library/new-file', {
    $fetch: { method: shouldUpdate.value ? 'PATCH' : 'POST' },
    hooks: {
      onSuccess() {
        emit('close', false)
        toast.add({
          title: shouldUpdate.value
            ? `File "${state.name}" updated`
            : `File "${state.name}" created`,
          color: 'success',
          icon: 'lucide:circle-check',
        })
      },
      onError(error) {
        toast.add({
          title: error.data?.message || (shouldUpdate.value ? 'Error updating file' : 'Error creating file'),
          color: 'error',
          icon: 'lucide:circle-x',
        })
      },
    },
  }, false)

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  name: z.string().min(1, 'File name is required!'),
})

const state = reactive<z.output<typeof schema>>({
  name: props.file?.name || '',
})

const isNewStateDifferentFromOldState = computed(() => {
  if (!shouldUpdate.value) return true
  return state.name !== props.file.name
})

const whatToSend = computed(() => {
  if (!shouldUpdate.value) return {
    name: state.name,
    folderId: props.file.folderId,
  }
  const update: Record<string, unknown> = { folderId: props.file.folderId, fileId: props.file.fileId }
  if (state.name !== props.file.name) update.name = state.name
  return update
})

</script>
