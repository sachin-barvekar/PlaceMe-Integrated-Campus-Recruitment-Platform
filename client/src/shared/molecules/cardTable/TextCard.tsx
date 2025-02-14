/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react'
import { Panel } from 'rsuite'
import { FaRupeeSign } from 'react-icons/fa'
import { ActionCell } from '../table/cells'
import './CardTable.scss'

interface TextCardProps extends React.ComponentProps<typeof Panel> {
  title?: string;
  subtitle?: string;
  date?: string;
  totalIncome?: number;
  totalExpense?: number;
  data?: any;
  onAction?: (eventKey?: string, rowData?: any) => void;
  handleSelection?: (rowData: any) => void;
  actionOptions?: any;
}

const TextCard: React.FC<TextCardProps> = ({
  title = 'Text Card title',
  subtitle,
  date,
  totalIncome,
  totalExpense,
  data,
  onAction,
  handleSelection,
  actionOptions
}) => {
  let borderClass = ''

  if (totalIncome !== undefined && totalExpense !== undefined) {
    if (totalExpense > totalIncome) {
      borderClass = 'high-expense'
    } else {
      borderClass = 'low-expense'
    }
  }

  const handleCardClick = () => {
    if (handleSelection && data) {
      handleSelection(data)
    }
  }

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      className={`card ${borderClass}`}
      onClick={handleCardClick}
      role="button"
      onKeyPress={(event) => {
        if (event.key === 'Enter') handleCardClick()
      }}
    >
      <div className="text-card-header">
        <h3>{title}</h3>
        <div className="text-card-action" onClick={handleActionClick}>
          <ActionCell
            rowData={data}
            dataKey="action"
            onAction={onAction}
            actionOptions={actionOptions}
          />
        </div>
      </div>
      <div className="text-card-body">
        {subtitle && <div>{subtitle}</div>}
        {date && <div>{date}</div>}
        <div className="income-expense">
          <div>
            Total Income: <br />
            <span className="income">
              <FaRupeeSign />
              {totalIncome}
            </span>
          </div>
          <div>
            Total Expense: <br />
            <span className="expense">
              <FaRupeeSign />
              {totalExpense}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextCard
