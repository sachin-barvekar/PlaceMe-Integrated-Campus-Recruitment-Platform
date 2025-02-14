import React from 'react'
import { Loader as SuiteLoader } from 'rsuite'

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <SuiteLoader backdrop vertical center />
    </div>
  )
}

export default Loader
