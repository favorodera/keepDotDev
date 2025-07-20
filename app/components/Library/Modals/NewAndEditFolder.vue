<template>

  <UModal
    :title="folder ? 'Edit Folder' : 'New Folder'"
    :dismissible="false"
    :ui="{
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      <span
        v-if="folder"
      >
        Edit <span class="font-bold">{{ folder.name }}</span> shelf
      </span>
      <span v-else>
        Create a new folder to organize your documentation
      </span>
    </template>

    <template #body>

      <UForm
        id="new-and-edit-folder-form"
        :state
        :schema
        class="space-y-4"
        @submit="execute({ $fetch: { body: whatToSend } })"
      >

        <UFormField
          name="name"
          label="Name"
          required
          description="The name of the folder"
        >
          <UInput
            v-model="state.name"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter a name for the folder"
            :disabled="status === 'pending'"
            size="lg"
          />
        </UFormField>

        <UFormField
          name="description"
          label="Description"
          required
          description="A detailed description of the folder"
          help="Max 100 characters"
        >
        
          <UTextarea
            v-model="state.description"
            :rows="2"
            placeholder="Enter a detailed description of the folder"
            :disabled="status === 'pending'"
            size="lg"
            :ui="{
              root: 'w-full',
              base: 'resize-none',
            }"
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
        :label="folder ? 'Update' : 'Create'"
        type="submit"
        form="new-and-edit-folder-form"
        :loading="status === 'pending'"
        :disabled="status === 'pending' || !isNewStateDifferentFromOldState"
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
  folder?: Pick<Folder, 'name' | 'description' | 'id' | 'owner_id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  name: z.string().min(1, 'Name is required!'),
  description: z.string().min(1, 'Description is required!').max(100, 'Max 100 characters!'),
})

const state = reactive<z.output<typeof schema>>({
  name: props.folder?.name || '',
  description: props.folder?.description || '',
})

const isNewStateDifferentFromOldState = computed(() => {
  if (!props.folder) return true
  return state.name !== props.folder.name
    || state.description !== props.folder.description
})

const whatToSend = computed(() => {
  if (!props.folder) return state

  const update: Record<string, unknown> = { folderId: props.folder.id }
  if (state.name !== props.folder.name) update.name = state.name
  if (state.description !== props.folder.description) update.description = state.description

  return update
})

const { execute, status } = useDollarFetch<AsyncSuccess, AsyncError>(
  props.folder ? '/api/library/edit-folder' : '/api/library/new-folder',
  {
    $fetch: { method: props.folder ? 'PATCH' : 'POST' },
    hooks: {
      onSuccess() {

        emit('close', false)
        toast.add({
          title: props.folder ? `Folder "${props.folder.name}" updated` : `Folder "${state.name}" created`,
          color: 'success',
          icon: 'lucide:circle-check',
        })
      },
      onError(error) {
        toast.add({
          title: error.data?.message || (props.folder ? 'Error updating folder' : 'Error creating folder'),
          color: 'error',
          icon: 'lucide:circle-x',
        })
      },
    },
  }, false)
</script>
