import fs from 'node:fs/promises'
import { join } from 'node:path'
import { ensureDirectoryExists, getPhotoDir } from '../utils'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (formData) {
    const dateItem = formData.find(x => x.name === 'date')
    const fileItem = formData.find(x => x.name === 'file')
    const passItem = formData.find(x => x.name === 'pass')
    if (dateItem == null || fileItem == null || passItem == null) {
      throw createError({ statusCode: 400 })
    }
    const date = dateItem.data.toString()
    const file = fileItem.data
    const pass = passItem.data.toString()
    const { PASSWORD } = useRuntimeConfig()
    if (pass !== PASSWORD)
      throw createError({ statusCode: 401, message: '操作密码错误' })
    const photoDir = getPhotoDir()
    await ensureDirectoryExists(photoDir)
    await fs.writeFile(join(photoDir, `${date}.png`), file)
  }
  else {
    throw createError({ statusCode: 400 })
  }
})
