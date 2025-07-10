const isOpen = ref(false)

export default function () {

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggle,
  }
}
