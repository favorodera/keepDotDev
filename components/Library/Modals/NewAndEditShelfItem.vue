<template>
  <UModal
    :title="shouldUpdate ? 'Edit Shelf Item' : 'New Shelf Item'"
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
        Edit <span class="font-bold">{{ props.shelfItem.name }}</span> shelf item
      </span>
      <span v-else>
        Create a new shelf item
      </span>
    </template>
    
    <template #body>
      <UForm
        id="new-and-edit-shelf-item-form"
        ref="formRef"
        :state
        :schema
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          required
          name="name"
          label="Name"
          description="The name of the shelf item"
        >
          <UInput
            v-model="state.name"
            :disabled="status === 'pending'"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter item name"
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
        form="new-and-edit-shelf-item-form"
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
  shelfItem: {
    name?: string
    itemId?: number
    shelfId: number
  }
}>()

const formRef = useTemplateRef('formRef')

const shouldUpdate = computed(() => {
  return !!props.shelfItem.name && !!props.shelfItem.itemId
})

const { execute, status, error } = useDollarFetch<AsyncSuccess, AsyncError>(
  shouldUpdate.value ? '/api/shelves-items/edit-name' : '/api/shelves-items/new', {
    method: shouldUpdate.value ? 'PATCH' : 'POST',
  }, false)

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()

const schema = z.object({
  name: z.string().min(1, 'Item name is required!'),
})

const state = reactive<z.output<typeof schema>>({
  name: props.shelfItem?.name || '',
})

const isNewStateDifferentFromOldState = computed(() => {
  if (!shouldUpdate.value) return true
  return state.name !== props.shelfItem.name
})

const whatToSend = computed(() => {
  if (!shouldUpdate.value) return {
    name: state.name,
    shelfId: props.shelfItem.shelfId,
  }
  const update: Record<string, unknown> = { shelfId: props.shelfItem.shelfId, itemId: props.shelfItem.itemId }
  if (state.name !== props.shelfItem.name) update.name = state.name
  return update
})

async function onSubmit() {
  await execute({ body: whatToSend.value })
}

watch([status, error], ([newStatus, newError]) => {
  if (newStatus === 'success') {
    emit('close', false)
    toast.add({
      title: shouldUpdate.value
        ? `Shelf item "${state.name}" updated`
        : `Shelf item "${state.name}" created`,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  } else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || (shouldUpdate.value ? 'Error updating shelf item' : 'Error creating shelf item'),
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
})
</script>
