import React from 'react'
import { Cell } from 'rsuite-table'
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md'
import { Whisper, Tooltip } from 'rsuite'
import './UserStatusCell.scss'

type Props = {
  rowData?: any,
  tooltip?: boolean
}

const defaultProps = {
  rowData: undefined
}

const statusOptions = [
  { label: 'Email', icon: <MdEmail />, statusKey: 'emailVerified' },
  { label: 'Mobile', icon: <MdPhone />, statusKey: 'mobileVerified' },
  { label: 'Profile', icon: <MdPerson />, statusKey: 'profileCompleted' }
]

const UserStatusCell: React.FC<Props> = ({ rowData, tooltip, ...props }) => {
  return (
    <Cell {...props} className="status-cell">
      <div className="status-cell-div">
        {statusOptions.map((status) => (
          <div key={status.label}>
            {tooltip ? (
              <Whisper
                placement="bottom"
                trigger="hover"
                speaker={
                  <Tooltip>
                    {rowData?.[status.statusKey]
                      ? `${status.label} Verified`
                      : `${status.label} Not Verified`}
                  </Tooltip>
                }
              >
                <div
                  className={
                    rowData?.[status.statusKey] ? 'verified' : 'unverified'
                  }
                >
                  <div className="status-icon">{status.icon}</div>
                </div>
              </Whisper>
            ) : (
              <div
                className={
                  rowData?.[status.statusKey] ? 'verified' : 'unverified'
                }
              >
                <div className="status-icon">{status.icon}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Cell>
  )
}

UserStatusCell.defaultProps = defaultProps

export default UserStatusCell
