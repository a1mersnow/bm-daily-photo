import fs from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { ensureDirectoryExists, getPhotoDir } from '../utils'

export default defineEventHandler(async () => {
  const photoDir = getPhotoDir()
  await ensureDirectoryExists(photoDir)
  const files = await fs.readdir(photoDir)
  return files.map(file => basename(file, extname(file)))
})
