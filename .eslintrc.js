/* eslint-env node */
module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'no-var': ['warn'],
    'arrow-spacing': ['warn'],
    'prefer-arrow-callback': ['warn'],
    'prefer-const': ['warn'],
    'array-bracket-spacing': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'never'],
    'space-in-parens': ['warn', 'never'],
    'comma-spacing': ['warn'],
    'comma-style': ['warn', 'last'],
    'func-call-spacing': ['warn'],
    'func-style': ['warn', 'declaration', {'allowArrowFunctions': true}],
    'key-spacing': ['warn'],
    'keyword-spacing': ['warn']
  }
}
