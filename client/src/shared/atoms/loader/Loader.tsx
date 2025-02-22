import React from 'react'
import { ReactComponent as LoaderIcon } from '../../../assets/images/loader.svg'
import './Loader.scss'

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div>
        <LoaderIcon className="loader-icon" />
      </div>
      <div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

export default Loader
