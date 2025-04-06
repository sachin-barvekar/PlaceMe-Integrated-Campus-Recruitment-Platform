import { useEffect } from 'react'
import { requestNotificationPermission } from '../utils'

const useFCM = () => {
  useEffect(() => {
    requestNotificationPermission()
  }, [])
}

export default useFCM
