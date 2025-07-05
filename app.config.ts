export default defineAppConfig({
  ui: {
    colors: {
      neutral: 'neutral',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5',
      },
    },
    dropdownMenu: {
      slots: {
        item: 'cursor-pointer',
      },
    },
  },
})
