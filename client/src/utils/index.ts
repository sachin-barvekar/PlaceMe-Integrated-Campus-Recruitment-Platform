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
