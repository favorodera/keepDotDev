<template>

  <div
    class="flex items-center"
  >

    <UIcon
      name="lucide:library-big"
      class="size-4"
      :class="iconClass"
    />

    <span
      v-if="!hideText"
      class="text-3"
      :class="textClass"
    >
      Keep.Dev
    </span>
  </div>

</template>

<script lang="ts" setup>
defineProps<{
  hideText?: boolean
  iconClass?: string
  textClass?: string
}>()
</script>
