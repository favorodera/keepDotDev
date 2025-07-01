<template>

  <UModal
    title="Sign Out"
    modal
    :ui="{
      content: 'max-w-sm',
      footer: 'flex justify-end',
    }"
    :close="{ onClick: () => emit('close', false) }"
  >

    <template #body>
      <p>Are you sure you want to sign out?</p>
    </template>

    <template #footer>

      <UButton
        variant="soft"
        square
        block
        @click="emit('close', false)"
      >
        Cancel
      </UButton>

      <UButton
        square
        block
        color="error"
        loading-auto
        @click="signOut"
      >
        Sign Out
      </UButton>
    </template>


  </UModal>

</template>

<script lang="ts" setup>
const emit = defineEmits<{ close: [boolean] }>()

const { signOut } = useAuth()
</script>
