import React from 'react'
import { Dropdown, IconButton, Popover, Whisper } from 'rsuite'
import { Cell } from 'rsuite-table'
import { MoreIcon } from '../../../atoms'

type Props = {
  rowData?: any,
  dataKey: string,
  onAction?: (eventKey: string | undefined, rowData: any) => void,
  actionOptions?: string[]
}

const defaultProps = {
  rowData: undefined,
  actionOptions: [],
  onAction: () => {}
}

const defaultOptions = [
  { label: 'View', eventKey: '1' },
  { label: 'Edit', eventKey: '2' },
  { label: 'Delete', eventKey: '3' },
  { label: 'Merge', eventKey: '4' },
  { label: 'Active', eventKey: '5' },
  { label: 'DeActive', eventKey: '6' }
]

const CardActionCell = ({
  rowData,
  dataKey,
  actionOptions,
  ...props
}: Props) => {
  const renderMenu = (
    { onClose, left, top, className }: any,
    ref: React.RefCallback<HTMLElement>
  ) => {
    const handleSelect = (eventKey: string | undefined) => {
      if (eventKey && typeof props.onAction === 'function') {
        props.onAction(eventKey, rowData)
      }
      onClose()
    }

    const optionsToDisplay = actionOptions?.length
      ? defaultOptions.filter((option) => actionOptions.includes(option.label))
      : defaultOptions

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          {optionsToDisplay.map((option) => (
            <Dropdown.Item key={option.eventKey} eventKey={option.eventKey}>
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Popover>
    )
  }

  return (
    <Cell {...props} className="link-group">
      <Whisper placement="bottomEnd" trigger="click" speaker={renderMenu}>
        <IconButton appearance="subtle" icon={<MoreIcon />} />
      </Whisper>
    </Cell>
  )
}

CardActionCell.defaultProps = defaultProps

export default CardActionCell
