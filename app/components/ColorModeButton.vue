<template>
  <ClientOnly v-if="!colorMode?.forced">

    <UButton
      :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
      color="neutral"
      variant="ghost"
      :label="colorModeLabel"
      square
      @click="isDark = !isDark"
    />

  </ClientOnly>
  
</template>

<script setup lang="ts">
const { showLabel = false } = defineProps<{ showLabel?: boolean }>()

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  },
})

const colorModeLabel = computed(() => {
  if (!showLabel) return
  return colorMode.preference === 'dark' ? 'Dark' : 'Light'
})
</script>
