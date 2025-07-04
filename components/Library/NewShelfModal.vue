<template>

  <UModal
    title="New Shelf"
    :description="`Create a new shelf to organize your documentation`"
    :dismissible="false"
    modal
    :ui="{
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false) }"
  >

    <template #body>

      <UForm
        id="new-shelf-form"
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
            size="lg"
          />
        </UFormField>

        <UFormField
          name="description"
          label="Description"
          required
          description="A detailed description of the shelf"
          help="Max 100 characters"
          hint="Optional"
        >
        
          <UTextarea
            v-model="state.description"
            :rows="2"
            placeholder="Enter a detailed description of the shelf"
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
          hint="Optional"
          help="Max 5 tags"
        >
    
          <UInputTags
            v-model="state.tags"
            :ui="{
              root: 'w-full',
            }"
            placeholder="Enter tags for the shelf"
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
        block
        size="lg"
        @click="emit('close', false)"
      />
      
      <UButton
        label="Create"
        type="submit"
        form="new-shelf-form"
        :loading="status === 'pending'"
        :disabled="status === 'pending'"
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
import type { AsyncError, AsyncSuccess } from '~/utils/types/app'

const toast = useToast()
const emit = defineEmits<{ close: [boolean] }>()
const { toggleSidebar, isMobile } = useSideBar()

const { execute, status, error } = useDollarFetch<AsyncSuccess, AsyncError>('/api/shelves/new', {
  method: 'POST',
}, false)

const schema = z.object({
  name: z.string().min(1, 'Name is required!'),
  description: z.string().min(1, 'Description is required!').max(100, 'Max 100 characters!'),
  tags: z.array(z.string()).min(1, 'Tags are required!').max(5, 'Max 5 tags!'),
})

const state = reactive<z.infer<typeof schema>>({
  name: '',
  description: '',
  tags: [],
})

async function onSubmit() {
  await execute({ body: state })
}

watch([status, error], ([newStatus, newError]) => {
  if (newStatus === 'success') {
    if (isMobile) {
      toggleSidebar()
    }

    emit('close', false)
    toast.add({
      title: `Shelf "${state.name}" created`,
      color: 'success',
      icon: 'lucide:check-circle',
    })
  } else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || 'Error creating shelf',
      color: 'error',
      icon: 'lucide:alert-circle',
    })
  }
})
</script>
