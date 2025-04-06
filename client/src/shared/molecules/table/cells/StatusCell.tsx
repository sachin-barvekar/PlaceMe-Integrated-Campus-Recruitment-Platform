import React from 'react'
import { Badge } from 'rsuite'
import { Cell } from 'rsuite-table'

type RowData = {
  [key: string]: string | boolean
}

type StatusCellProps = {
  rowData?: RowData
  dataKey: string
  posDataLabel?: string
  negDataLabel?: string
}

const activeLabels = ['Active', 'Live', true, 'Yes']

const activeStyle = {
  backgroundColor: '#ECFDF3',
  color: '#14BA6D',
  padding: '3px 10px 3px 5px',
}

const inactiveStyle = {
  backgroundColor: '#F2F4F7',
  color: '#6C778B',
  padding: '3px 10px 3px 5px',
}

const StatusCell: React.FC<StatusCellProps> = ({
  rowData = undefined,
  dataKey,
  posDataLabel,
  negDataLabel,
  ...props
}) => {
  const label = rowData?.[dataKey]
  const isActive = activeLabels.includes(label as string | boolean)

  return (
    <Cell {...props}>
      <Badge
        style={isActive ? activeStyle : inactiveStyle}
        content={
          <>
            <Badge
              style={{
                backgroundColor: isActive ? '#14BA6D' : '#6C778B',
                margin: '0 7px',
              }}
            />
            {isActive ? posDataLabel : negDataLabel || label}
          </>
        }
      />
    </Cell>
  )
}

export default StatusCell
