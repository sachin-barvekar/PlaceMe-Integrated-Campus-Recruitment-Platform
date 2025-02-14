/* eslint-disable no-nested-ternary */
import React from 'react'
import { Cell } from 'rsuite-table'
import './IECell.scss'

type RowData = {
  [key: string]: string | boolean
}

type TransactionTypeCellProps = {
  rowData?: RowData,
  dataKey: string
}

const IECell: React.FC<TransactionTypeCellProps> = ({
  rowData,
  dataKey,
  ...props
}) => {
  const type = rowData?.[dataKey]
  const lowerCaseType = typeof type === 'string' ? type.toLowerCase() : ''

  return (
    <Cell {...props}>
      <span
        className={`ie-cell ${
          lowerCaseType === 'income'
            ? 'income'
            : lowerCaseType === 'expense'
              ? 'expense'
              : 'other'
        }`}
      >
        {type}
      </span>
    </Cell>
  )
}

export default IECell
