import React from 'react'
import { Cell } from 'rsuite-table'
import './PaymentJourneyStatusCell.scss'

type RowData = {
  [key: string]: string | boolean
}

type PaymentJourneyStatusCellProps = {
  rowData?: RowData,
  dataKey: string
}

const PaymentJourneyStatusCell: React.FC<PaymentJourneyStatusCellProps> = ({
  rowData,
  dataKey,
  ...props
}) => {
  const status = rowData?.[dataKey] as string | undefined
  const lowerCaseStatus = status
    ? status.toLowerCase().replace(/\s+/g, '_')
    : ''

  return (
    <Cell {...props}>
      <span className={`status-badge status-${lowerCaseStatus}`}>{status}</span>
    </Cell>
  )
}

export default PaymentJourneyStatusCell
