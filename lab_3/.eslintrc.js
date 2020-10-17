module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['prettier', '@babel'],
  extends: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 2,
  },
};
