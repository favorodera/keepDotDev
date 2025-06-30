<template>

  <div
    class="flex items-center"
  >

    <UIcon
      name="lucide:library-big"
      class="size-4"
    />

    <span
      v-if="!hideText"
      class="text-3"
    >
      Keep.Dev
    </span>
  </div>

</template>

<script lang="ts" setup>
defineProps<{
  hideText?: boolean
}>()
</script>
