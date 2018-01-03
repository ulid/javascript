import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript'
import compiler from 'typescript'


const defaultConfig = {
  name: 'ULID',
  input: './lib/index.ts',
}

const defaultPlugins = [
  typescript({ typescript: compiler })
]

const esModuleConfig = Object.assign({}, defaultConfig, {
  output: {
    format: 'es',
    file: './dist/index.esm.js'
  },
  plugins: [
    ...defaultPlugins,
    babel()
  ]
})

const umdConfig = Object.assign({}, defaultConfig, {
  output: {
    format: 'umd',
    file: './dist/index.umd.js'
  },
  plugins: [
    ...defaultPlugins,
    babel()
  ]
})

export default [
  esModuleConfig,
  umdConfig
]
