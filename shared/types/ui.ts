export type ToastType = 'SUCCESS' | 'ERROR'

export interface ToastOptions {
  type: ToastType
  message: string
  timeout?: number
}

export type ToastCompProps = Omit<ToastOptions, 'timeout'>
