import fs from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { ensureDirectoryExists, getPhotoDir } from '../utils'

const dateExp = /\d{4}-\d{2}-\d{2}/
export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const photoDir = getPhotoDir()
  if (formData) {
    let success = false
    await ensureDirectoryExists(photoDir)
    for (const item of formData) {
      if (item.filename && item.data) {
        const date = basename(item.filename, extname(item.filename))
        if (!dateExp.test(date))
          continue
        const file = item.data
        await fs.writeFile(join(photoDir, `${date}.png`), file)
        success = true
      }
    }
    if (!success) {
      throw createError({ statusCode: 500 })
    }
  }
  else {
    throw createError({ statusCode: 400 })
  }
})
