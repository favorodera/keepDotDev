<template>

  <div
    class="flex items-center"
  >

    <UIcon
      name="lucide:library-big"
      class="size-5"
    />

    <span
      v-if="!hideText"
      class="text-[1.125rem]"
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
