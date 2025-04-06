import { FC } from 'react'
import {
  Button,
  Uploader as RsuiteUploader,
  UploaderProps as RsuiteUploaderProps,
} from 'rsuite'
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro'
import './Uploader.scss'

interface UploaderProps extends RsuiteUploaderProps {
  fileInfo?: string
}

const Uploader: FC<UploaderProps> = ({ fileInfo, ...props }: UploaderProps) => {
  return (
    <RsuiteUploader
      className='uploader'
      multiple={false}
      fileListVisible={false}
      {...props}>
      <Button>
        {fileInfo ? (
          <img src={fileInfo} alt='file' width='100%' height='100%' />
        ) : (
          <CameraRetroIcon className='uploader-btn' />
        )}
      </Button>
    </RsuiteUploader>
  )
}

export default Uploader
