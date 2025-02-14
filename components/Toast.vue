<script setup lang="ts">
import type { ToastOptions } from '~/shared/types/ui'

defineProps<{
  options: ToastOptions
}>()
</script>

<template>
  <div flex="~ justify-center" pointer-events-none fixed top-6 w-full>
    <div
      border="2px solid"
      :class="options.type === 'SUCCESS' ? 'border-green-600' : 'border-red-600'"
      max-w-40vw w-max rd bg-white px4 py2 text-sm shadow-lg flex="~ items-center gap-x-2"
    >
      <Icon
        :name="options.type === 'SUCCESS' ? 'ph:check-fat-bold' : 'ph:warning-bold'"
        class="text-base"
        :class="options.type === 'SUCCESS' ? 'text-green-600' : 'text-red-600'"
      />
      <div>
        {{ options.message }}
      </div>
    </div>
  </div>
</template>
