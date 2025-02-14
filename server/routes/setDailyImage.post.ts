import fs from 'node:fs/promises'
import { join } from 'node:path'
import { ensureDirectoryExists, getPhotoDir } from '../utils'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (formData) {
    const dateItem = formData.find(x => x.name === 'date')
    const fileItem = formData.find(x => x.name === 'file')
    if (dateItem == null || fileItem == null) {
      throw createError({ statusCode: 404 })
    }
    const date = dateItem.data
    const file = fileItem.data
    const photoDir = getPhotoDir()
    await ensureDirectoryExists(photoDir)
    await fs.writeFile(join(photoDir, `${date}.png`), file)
  }
  else {
    throw createError({ statusCode: 400 })
  }
})
