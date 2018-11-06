module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  env: {
    jest: true,
  },
  rules: {
    // @TODO: remove next two lines when https://github.com/babel/babel-eslint/issues/530
    // gets fixed.
    'template-curly-spacing': 0,
    indent: 0,
    semi: ['error', 'never'],
    'import/prefer-default-export': 0,
  },
}
