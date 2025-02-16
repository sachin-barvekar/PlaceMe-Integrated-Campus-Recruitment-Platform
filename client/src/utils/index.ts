import { toast } from 'react-toastify'

export const notifySuccess = (message: string) => toast.success(message)

export const notifyError = (message: string) => toast.error(message)

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
