import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#FF6A00',
    },
  },
  shortcuts: [
   
  ],
  presets: [
    presetUno(),
    presetAttributify(),
  ],
  rules: [
   
  ],
  transformers: [
    transformerDirectives(),
  ],
})
