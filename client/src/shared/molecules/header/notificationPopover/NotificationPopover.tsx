import React, { useEffect, useState } from 'react'
import { Whisper, Popover, Badge, Nav } from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import { useFetchNotificationsQuery } from '../../../../pages/login/loginApiSlice'
import './notification.scss'
import Loader from '../../../atoms/loader/Loader'
import { formatDistanceToNow } from 'date-fns'

const NotificationPopover: React.FC = () => {
  const { data, isFetching } = useFetchNotificationsQuery()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications)
      setUnreadCount(data.notifications.length)
    }
  }, [data])

  return (
    <Whisper
      trigger='click'
      placement='bottomEnd'
      speaker={
        <Popover full className='notification-popover'>
          <div className='popover-header'>Notifications</div>
          {isFetching ? (
            <Loader />
          ) : notifications.length === 0 ? (
            <p className='no-notifications'>No notifications</p>
          ) : (
            <ul className='notification-list'>
              {notifications.map(notif => (
                <li key={notif._id} className='notification-item'>
                  <div className='notification-content'>
                    <p className='notification-message'>{notif.message}</p>
                    <span className='notification-time'>
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Popover>
      }>
      <Nav.Item className='notification-icon'>
        <Badge content={unreadCount > 0 ? unreadCount : null} />
        <NoticeIcon />
      </Nav.Item>
    </Whisper>
  )
}

export default NotificationPopover
