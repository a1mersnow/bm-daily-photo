import fs from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import dayjs from 'dayjs'
import { PHOTO_DIR } from '~/shared/constants'

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath)
  }
  catch (error) {
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException
      if (nodeError.code === 'ENOENT') {
        await fs.mkdir(dirPath, { recursive: true })
      }
      else {
        throw error
      }
    }
    else {
      throw new TypeError('Failed to access directory due to an unknown error.')
    }
  }
}

export function getPhotoDir() {
  return join('./public', PHOTO_DIR)
}

export async function cleanPhotoDir() {
  const dir = getPhotoDir()
  const items = await fs.readdir(dir)
  const threshold = dayjs().subtract(2, 'D')
  for (const item of items) {
    const date = basename(item, extname(item))
    if (dayjs(date).isBefore(threshold)) {
      await fs.unlink(join(dir, item))
    }
  }
}
