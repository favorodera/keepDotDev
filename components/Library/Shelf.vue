<template>

  <main
    class="flex flex-auto items-start p-4 w-full"
  >

    <div class="flex gap-2 justify-between items-center w-full">
      <UButton
        icon="lucide:chevron-left"
        variant="ghost"
        color="neutral"
        size="sm"
        label="Back"
        to="/library"
      />

      <UPopover
        v-model:open="isPopoverOpen"
        :ui="{
          content: 'p-4',
        }"
      >

        <UButton
          icon="lucide:plus"
          label="Add item"
          size="sm"
          variant="soft"
          color="neutral"
        />

        <template #content>

          <UForm
            :state
            class="space-y-4"
            :schema
            @submit="onSubmit"
          >
            <UFormField
              required
              name="fileName"
              label="File name"
              help="File extension not required"
            >

              <UInput
                v-model="state.fileName"
                :disabled="status === 'pending'"
                :ui="{
                  root: 'w-full',
                }"
                placeholder="Enter file name"
              />
            </UFormField>

           
            <UButton
              label="Add"
              :loading="status === 'pending'"
              :disabled="status === 'pending'"
              color="primary"
              size="sm"
              type="submit"
              variant="soft"
              block
            />
            

          </UForm>
          
        </template>

      </UPopover>

    </div>
  </main>

</template>

<script lang="ts" setup>
import { z } from 'zod'

const isPopoverOpen = ref(false)
const toast = useToast()
const shelfId = useRoute().params.shelfId
const schema = z.object({
  fileName: z.string().min(1, 'File name is required!'),
})
const state = reactive<z.output<typeof schema>>({
  fileName: '',
})
const { data, execute, status, error } = useDollarFetch<AsyncSuccess, AsyncError>('/api/shelves-items/new', {
  method: 'POST',
}, false)

function onSubmit() {
  execute({
    body: {
      name: state.fileName,
      shelfId,
    },
  })
}

watch([data, status, error], ([newData, newStatus, newError]) => {
  if (newStatus === 'success' && newData) {

    isPopoverOpen.value = false

    toast.add({
      title: newData.message,
      color: 'success',
      icon: 'lucide:circle-check',
    })
  } else if (newError && newStatus === 'error') {
    toast.add({
      title: newError.data?.message || 'Error creating file',
      color: 'error',
      icon: 'lucide:circle-x',
    })
  }
})
</script>
