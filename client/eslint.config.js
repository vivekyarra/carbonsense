import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsdoc from 'eslint-plugin-jsdoc'

export default [
  {
    ignores: ['dist', 'coverage', 'src/tests/**', '**/*.test.js', '**/*.test.jsx', 'src/tests/setup.js'],
  },
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      jsdoc
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      "jsdoc/require-jsdoc": ["error", {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        }
      }],
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-file-overview": "error",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-param-type": "off"
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
        process: 'readonly',
        module: 'readonly'
      },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
  },
]
