const isVisible = ref(false)
const isExpanded = ref(false)


const isMobile = useMediaQuery('(max-width: 767px)')

export default function () {

  function toggleVisibility() {
    isVisible.value = !isVisible.value
  }

  function toggleExpansion() {
    isExpanded.value = !isExpanded.value
  }

  function toggleSidebar() {
    if (isMobile.value) {
      toggleVisibility()
    } else {
      toggleExpansion()
    }
  }

  return {
    isVisible,
    isExpanded,
    toggleSidebar,
    toggleVisibility,
    toggleExpansion,
    isMobile,
  }
}


