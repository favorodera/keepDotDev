<template>

  <UModal
    :title="shelf ? 'Edit Shelf' : 'New Shelf'"
    :dismissible="false"
    modal
    :ui="{
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false), disabled: status === 'pending' }"
  >

    <template #description>
      <span
        v-if="shelf"
      >
        Edit <span class="font-bold">{{ shelf.name }}</span> shelf
      </span>
      <span v-else>
        Create a new shelf to organize your documentation
      </span>
    </template>

    <template #body>

      <UForm
        id="new-and-edit-shelf-form"
        :state
        :schema
        class="space-y-4"
        @submit="onSubmit"
      >

        <UFormField
          name="name"
          label="Name"
          required
          description="The name of the shelf"
        >
          <UInput
            v-model="state.name"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter a name for the shelf"
            :disabled="status === 'pending'"
            size="lg"
          />
        </UFormField>

        <UFormField
          name="description"
          label="Description"
          required
          description="A detailed description of the shelf"
          help="Max 100 characters"
        >
        
          <UTextarea
            v-model="state.description"
            :rows="2"
            placeholder="Enter a detailed description of the shelf"
            :disabled="status === 'pending'"
            size="lg"
            :ui="{
              root: 'w-full',
              base: 'resize-none',
            }"
          />
        
        </UFormField>

        <UFormField
          name="tags"
          label="Tags"
          required
          description="Tags to help you organize your shelf"
          help="Max 5 tags"
        >
    
          <UInputTags
            v-model="state.tags"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter tags for the shelf"
            size="lg"
            :disabled="status === 'pending'"
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
        :label="shelf ? 'Update' : 'Create'"
        type="submit"
        form="new-and-edit-shelf-form"
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
  shelf?: Pick<Shelf, 'name' | 'description' | 'tags' | 'id' | 'owner_id'>
}>()

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()
const { isOpen } = useSideBar()

const { execute, status, error } = useDollarFetch<AsyncSuccess, AsyncError>(props.shelf ? '/api/shelves/edit' : '/api/shelves/new', {
  method: props.shelf ? 'PATCH' : 'POST',
}, false)

const schema = z.object({
  name: z.string().min(1, 'Name is required!'),
  description: z.string().min(1, 'Description is required!').max(100, 'Max 100 characters!'),
  tags: z.array(z.string()).min(1, 'Tags are required!').max(5, 'Max 5 tags!'),
})

const state = reactive<z.output<typeof schema>>({
  name: props.shelf?.name || '',
  description: props.shelf?.description || '',
  tags: props.shelf?.tags || [],
})

const isNewStateDifferentFromOldState = computed(() => {
  if (!props.shelf) return true
  return state.name !== props.shelf.name
    || state.description !== props.shelf.description
    || JSON.stringify(state.tags) !== JSON.stringify(props.shelf.tags)
})

const whatToSend = computed(() => {
  if (!props.shelf) return state

  const update: Record<string, unknown> = { shelfId: props.shelf.id }
  if (state.name !== props.shelf.name) update.name = state.name
  if (state.description !== props.shelf.description) update.description = state.description
  if (JSON.stringify(state.tags) !== JSON.stringify(props.shelf.tags)) update.tags = state.tags

  return update
})

async function onSubmit() {
  await execute({ body: whatToSend.value })
}

watch([status, error], ([newStatus, newError]) => {
  if (newStatus === 'success') {
    isOpen.value = false

    emit('close', false)
    toast.add({
      title: props.shelf ? `Shelf "${props.shelf.name}" updated` : `Shelf "${state.name}" created`,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  } else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || (props.shelf ? 'Error updating shelf' : 'Error creating shelf'),
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
})
</script>
