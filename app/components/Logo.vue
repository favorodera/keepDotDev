<template>

  <div
    class="flex items-center text-base"
  >

    <UIcon
      name="lucide:library-big"
      :class="iconClass"
    />

    <span
      v-if="!hideText"
      class="font-mono"
      :class="textClass"
    >
      keepdotdev
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
