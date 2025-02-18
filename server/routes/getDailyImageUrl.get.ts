import dayjs from 'dayjs'
import { PHOTO_DIR } from '~/shared/constants'
import { cleanPhotoDir } from '../utils'

export default defineEventHandler(async (event) => {
  event.waitUntil(cleanPhotoDir())
  const today = dayjs().format('YYYY-MM-DD')
  const { DOMAIN } = useRuntimeConfig()
  return {
    imageUrl: `${DOMAIN}/${PHOTO_DIR}/${today}.png`,
  }
})
