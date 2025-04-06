import { useEffect } from 'react'
import { onMessage } from 'firebase/messaging'
import { messaging } from '../../../config/firebase'
import { notifyInfo } from '../../../utils'

const FcmNotification = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, payload => {
      notifyInfo(payload.notification?.title || 'New Notification')
    })

    return () => unsubscribe()
  }, [])

  return null
}

export default FcmNotification
