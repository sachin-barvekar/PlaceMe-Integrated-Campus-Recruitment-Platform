import { ToastOptions, toast } from 'react-toastify'

export const notifySuccess = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown> | undefined
) =>
  toast.success(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyInfo = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown> | undefined
) =>
  toast.info(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyWarning = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown> | undefined
) =>
  toast.warning(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export const notifyError = (
  message: string | JSX.Element,
  options?: ToastOptions<unknown> | undefined
) =>
  toast.error(message, {
    ...options,
    containerId: options?.containerId ?? 'default',
    autoClose: 3000
  })

export interface FileObject {
  blobFile: File;
  name: string;
  status: string;
  fileKey: string;
}

export function isFileObject(value: any): value is FileObject {
  return value && typeof value === 'object' && 'blobFile' in value
}

export function previewFile(
  file: Blob | undefined,
  callback: { (value: any): void, (arg0: string | ArrayBuffer | null): void }
) {
  const reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result)
  }
  if (file) {
    reader.readAsDataURL(file)
  }
}
