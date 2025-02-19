<script setup lang="ts">
import type { Day } from './shared/types/day'
import type { ToastCompProps, ToastOptions } from './shared/types/ui'
import dayjs from 'dayjs'
import { FetchError } from 'ofetch'
import { PHOTO_DIR } from '~/shared/constants'

const MAX_FUTURE_DAY_COUNT = 30

const { data: filledDays, execute } = useFetch<string[]>('/getFilledDays')
const filledSet = computed(() => new Set(filledDays.value))

const passFromUser = useLocalStorage('PASSWORD_FROM_USER', '')
const initialPassFromUserDraft = ref('')
const hasSetPass = useLocalStorage('HAS_SET_PASS', false)
const mounted = useMounted()

function confirmInitialPass() {
  passFromUser.value = initialPassFromUserDraft.value
  hasSetPass.value = true
}

const renderKey = ref(0)
function refresh() {
  renderKey.value++
  execute()
}

function isFilled(date: string) {
  return filledSet.value.has(date)
}

const futureDays = ref<Day[]>([])
watch(filledSet, () => {
  futureDays.value = createDays().map((day) => {
    return {
      ...day,
      image: isFilled(day.date) ? `/${PHOTO_DIR}/${day.date}.png` : '',
    }
  })
}, { immediate: true, flush: 'sync' })

useHead({
  titleTemplate: () => 'Daily Photo',
})

function createDays() {
  const today = dayjs()
  return Array.from({ length: MAX_FUTURE_DAY_COUNT }).map((_, i) => {
    return {
      date: today.add(i, 'd').format('YYYY-MM-DD'),
      image: '',
      uploading: false,
    }
  })
}

const multiUploading = ref(false)
async function handleMultiChange(event: Event) {
  const el = event.target as HTMLInputElement
  const files = el.files || []
  if (files.length === 0)
    return
  const formData = new FormData()
  formData.append('pass', passFromUser.value)
  for (const f of files)
    formData.append('files', f)
  try {
    multiUploading.value = true
    await $fetch('/setDailyImages', {
      body: formData,
      method: 'POST',
    })
    toastSuccess('上传成功')
    refresh()
  }
  catch (e) {
    toastError(e instanceof FetchError ? e.data.message : '上传失败')
  }
  finally {
    multiUploading.value = false
    el.value = ''
  }
}

async function handleSingleChange(day: Day, event: Event) {
  const el = event.target as HTMLInputElement
  const file = el.files?.[0]
  if (!file)
    return
  const formData = new FormData()
  formData.append('date', day.date)
  formData.append('file', file)
  formData.append('pass', passFromUser.value)
  try {
    day.uploading = true
    await $fetch('/setDailyImage', {
      body: formData,
      method: 'POST',
    })
    toastSuccess('上传成功')
    refresh()
  }
  catch (e) {
    toastError(e instanceof FetchError ? e.data.message : '上传失败')
  }
  finally {
    day.uploading = false
    el.value = ''
  }
}

const msgOptions = ref<ToastCompProps>()
const toastShow = ref(false)
let timer: number | undefined
function toast(options: ToastOptions) {
  const { timeout = 2500, type, message } = options
  toastShow.value = true
  msgOptions.value = { type, message }
  if (timer)
    window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    msgOptions.value = undefined
    toastShow.value = false
  }, timeout)
}

function toastSuccess(m: string) {
  toast({ type: 'SUCCESS', message: m })
}

function toastError(m: string) {
  toast({ type: 'ERROR', message: m })
}
</script>

<template>
  <template v-if="mounted">
    <div v-if="hasSetPass" p2 grid="~ gap2">
      <div flex="~ items-center justify-between">
        <div flex="~ items-center gap-x-3">
          <label
            class="cursor-pointer rd-full bg-primary px5 py2 text-sm text-white"
            :class="multiUploading ? 'op50 pointer-events-none' : ''"
          >
            {{ multiUploading ? '上传中...' : '批量上传' }}
            <input
              type="file"
              multiple
              accept="image/*"
              class="sr-only"
              @change="handleMultiChange"
            >
          </label>
          <p class="text-sm text-black/80 font-normal">
            文件名需满足格式：2025-01-01
          </p>
        </div>

        <div flex="~ items-center gap-x-2" text-sm>
          <div>操作密码：</div>
          <input
            v-model="passFromUser"
            type="password" border="~ solid primary" class="lh-[1.2]" rd-full px4 py2
            outline-none
            placeholder="请输入操作密码"
            autocomplete="new-password"
          >
        </div>
      </div>
      <div grid="~ cols-minmax-300px gap2">
        <div
          v-for="d in futureDays" :key="d.date"
          class="of-hidden rd bg-primary/10"
        >
          <div class="px2 text-sm text-primary lh-[2]" flex="~ items-center justify-between">
            <div>
              {{ d.date }}
            </div>
            <Icon v-if="d.uploading" name="ph:cloud-arrow-up" class="animate-bounce" />
            <Icon v-else-if="d.image" name="ph:cloud" />
            <Icon v-else name="ph:cloud-slash" />
          </div>
          <div class="group relative aspect-ratio-16/9 bg-primary/10">
            <NuxtImg
              v-if="d.image"
              :key="renderKey"
              class="h-full w-full"
              width="1920"
              height="1080"
              sizes="300px"
              :src="d.image"
            />

            <div
              flex="~ items-center justify-center"
              absolute inset-0 h-full p2 transition
              :class="!d.image ? '' : 'op0 group-hover:op60'"
            >
              <label cursor-pointer>
                <Icon
                  name="ph:upload-fill"
                  class="text-primary"
                  :class="d.image ? 'text-4xl' : 'text-8xl'"
                />
                <input
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  @change="handleSingleChange(d, $event)"
                >
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else flex="~ items-center justify-center" fixed inset-0>
      <div flex="~ col items-center gap-4" text-sm>
        <div text-lg>
          请输入操作密码
        </div>
        <input
          v-model="initialPassFromUserDraft"
          type="password" border="2px solid primary" class="lh-[1.2]"
          w-80 rd-full px8 py3 text-center text-lg outline-none
          placeholder="密码请咨询开发者"
          autocomplete="new-password"
        >

        <button
          class="w-30 rd-full bg-primary px4 py3 text-center text-base text-white"
          @click="confirmInitialPass"
        >
          确定
        </button>
      </div>
    </div>
  </template>

  <Transition name="fade-in-down">
    <Toast v-if="toastShow" :options="msgOptions!" />
  </Transition>
</template>
