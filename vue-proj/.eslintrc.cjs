/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'prettier/prettier': [
      'error',
      { singleQuote: true, semi: true },
      { usePrettierrc: false },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
  },
};
