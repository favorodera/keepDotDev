export default defineAppConfig({
  ui: {
    colors: {
      neutral: 'neutral',
    },
    button: {
      slots: {
        base: 'cursor-pointer',
        label: 'text-sm sm:text-base',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5',
      },
    },
  },
})
