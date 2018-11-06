module.exports = (api) => {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: 'commonjs',
        },
      ],
      '@babel/preset-flow',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      'babel-plugin-add-module-exports',
      '@babel/plugin-proposal-class-properties',
    ],
  }
}
