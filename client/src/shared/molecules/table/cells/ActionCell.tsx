import React from 'react'
import { Cell } from 'rsuite-table'
import EditIcon from '@rsuite/icons/Edit'
import TrashIcon from '@rsuite/icons/Trash'
import VisibleIcon from '@rsuite/icons/Visible'
import ShareOutlineIcon from '@rsuite/icons/ShareOutline'
import { RiSecurePaymentFill } from 'react-icons/ri'
import { Whisper, Tooltip } from 'rsuite'
import './ActionCell.scss'
import { MdNotificationsActive, MdFileDownload } from 'react-icons/md'

type Props = {
  rowData?: any,
  dataKey: string,
  onAction?: (eventKey: string | undefined, rowData: any) => void,
  actionOptions?: string[],
  tooltip?: boolean
}

const defaultProps = {
  rowData: undefined,
  actionOptions: [],
  onAction: () => {}
}

const defaultOptions = [
  { label: 'View', eventKey: '1', icon: <VisibleIcon /> },
  { label: 'Edit', eventKey: '2', icon: <EditIcon /> },
  { label: 'Delete', eventKey: '3', icon: <TrashIcon /> },
  { label: 'Share', eventKey: '4', icon: <ShareOutlineIcon /> },
  {
    label: 'Send Notification',
    eventKey: '5',
    icon: <MdNotificationsActive />
  },
  { label: 'Download', eventKey: '6', icon: <MdFileDownload /> },
  { label: 'Make Payment', eventKey: '7', icon: <RiSecurePaymentFill /> }
]

const ActionCell: React.FC<Props> = ({
  rowData,
  dataKey,
  actionOptions = [],
  tooltip,
  ...props
}) => {
  const optionsToDisplay =
    actionOptions.length > 0
      ? defaultOptions.filter((option) => actionOptions.includes(option.label))
      : defaultOptions

  const handleActionClick = (eventKey: string | undefined) => {
    if (eventKey && typeof props.onAction === 'function') {
      props.onAction(eventKey, rowData)
    }
  }

  return (
    <Cell {...props} className="link-group">
      <div className="action-icons-wrapper">
        {optionsToDisplay.map((option) => (
          <button
            type="button"
            key={option.eventKey}
            className="action-icon"
            onClick={() => handleActionClick(option.eventKey)}
          >
            {tooltip ? (
              <Whisper
                key={option.eventKey}
                placement="bottom"
                trigger="hover"
                speaker={<Tooltip>{option.label}</Tooltip>}
              >
                <div className="icon-container">{option.icon}</div>
              </Whisper>
            ) : (
              <div className="icon-container">{option.icon}</div>
            )}
          </button>
        ))}
      </div>
    </Cell>
  )
}

ActionCell.defaultProps = defaultProps

export default ActionCell
