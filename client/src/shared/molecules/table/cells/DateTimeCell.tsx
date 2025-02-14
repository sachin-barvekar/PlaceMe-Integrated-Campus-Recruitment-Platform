import React from 'react'
import { Cell } from 'rsuite-table'
import { format as formatDate, isValid } from 'date-fns'

type DateTimeCellProps = {
  rowData?: any,
  dataKey: string,
  format?: string,
  onCellClick?: (rowData: any) => void
}

const DateTimeCell: React.FC<DateTimeCellProps> = ({
  rowData,
  dataKey,
  format,
  onCellClick,
  ...props
}) => {
  const value = rowData[dataKey] ?? null
  const formattedValue =
    value && isValid(new Date(value))
      ? formatDate(new Date(value), format || 'dd/MM/yyyy')
      : '-'

  return (
    <Cell
      {...props}
      onClick={() => {
        if (onCellClick) {
          onCellClick(rowData)
        }
      }}
    >
      {formattedValue}
    </Cell>
  )
}

export default DateTimeCell
