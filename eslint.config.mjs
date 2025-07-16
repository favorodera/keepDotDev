import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@stylistic/no-multiple-empty-lines': [
      'error',
      {
        max: 3,
        maxEOF: 3,
        maxBOF: 0,
      },
    ],
    '@stylistic/padded-blocks': 'off',
    '@stylistic/no-trailing-spaces': [
      'error',
      {
        skipBlankLines: true,
      },
    ],
    'vue/multi-word-component-names': 'off',
    '@stylistic/brace-style': 'off',
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        allowEmptyLines: true,
        ignores: ['pre', 'textarea'],
      },
    ],
    'vue/max-len': [
      'error',
      {
        code: 150,
        template: 150,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreHTMLAttributeValues: true,
        ignoreHTMLTextContents: true,
      },
    ],
    'vue/block-tag-newline': [
      'error',
      {
        multiline: 'ignore',
        singleline: 'ignore',
      },
    ],
  },
})
