<template>

  <UModal
    title="Sign Out"
    description="Sign out of your account"
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
        label="No"
        color="neutral"
        icon="lucide:circle-x"
        block
        @click="emit('close', false)"
      />

      <UButton
        label="Yes"
        icon="lucide:circle-check"
        square
        block
        color="error"
        variant="soft"
        loading-auto
        @click="signOut"
      />
    </template>


  </UModal>

</template>

<script lang="ts" setup>
const emit = defineEmits<{ close: [boolean] }>()

const { signOut } = useAuth()
</script>
