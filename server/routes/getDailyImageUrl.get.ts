import dayjs from 'dayjs'
import { cleanPhotoDir } from '../utils'

export default defineEventHandler(async (event) => {
  event.waitUntil(cleanPhotoDir())
  const today = dayjs().format('YYYY-MM-DD')
  return {
    imageUrl: `${today}.png`,
  }
})
