module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'error',
      'single',
      {avoidEscape: true, allowTemplateLiterals: false}
    ],
    semi: ['error', 'never'],
    '@typescript-eslint/generic-type-naming': ['error', '^T[A-Z][a-zA-Z]+$'],
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': ['error'],
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {ignoreNumericLiteralTypes: true}
    ]
  },
  'overrides': [
    {
      'files': ['test/**/*.*'],
      'rules': {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
}
