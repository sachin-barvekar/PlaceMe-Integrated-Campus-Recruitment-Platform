import React from 'react'
import { Loader as LoaderIcon } from 'rsuite'
import './Loader.scss'

const Loader: React.FC = () => {
  return (
    <div className='loader'>
      <div>
        <LoaderIcon size='md' className='loader-icon' />
      </div>
      <div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
