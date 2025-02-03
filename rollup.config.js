const typescript = require('@rollup/plugin-typescript');
const { babel } = require('@rollup/plugin-babel');

const defaultConfig = {
  input: './lib/index.ts',
};

const defaultPlugins = [
  typescript({
    tsconfig: 'tsconfig.json'
  })
];

const esModuleConfig = Object.assign({}, defaultConfig, {
  output: {
    name: 'ULID',
    format: 'es',
    file: './dist/index.esm.js'
  },
  plugins: [
    ...defaultPlugins,
    babel({ babelHelpers: 'bundled' })
  ]
})

const umdConfig = Object.assign({}, defaultConfig, {
  output: {
    name: 'ULID',
    format: 'umd',
    file: './dist/index.umd.js'
  },
  plugins: [
    ...defaultPlugins,
    babel({ babelHelpers: 'bundled' })
  ]
})

module.exports = [
  esModuleConfig,
  umdConfig
];
