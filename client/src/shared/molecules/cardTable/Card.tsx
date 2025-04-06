/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from 'rsuite'
import './CardTable.scss'
import { CardActionCell } from '../table/cells'

interface CardProps {
  imageUrl: string
  name: string
  Branch: string
  CompanyName: string
  Designation: string
  Package: string
  CompanyLocation: string
  onAction?: (eventKey: string | undefined, rowData: any) => void
  data?: any
  actionOptions?: string[]
  handleSelection?: (rowData: any) => void
  selected?: boolean
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  name,
  Branch,
  CompanyName,
  Designation,
  Package,
  onAction,
  data,
  actionOptions,
  CompanyLocation,
  handleSelection,
  selected = false,
}) => {
  return (
    <div className={`card ${selected ? 'selected' : ''}`}>
      <div className='card-header'>
        <img src={imageUrl} alt={name} />
      </div>

      <div className='card-body'>
        <h3>{name}</h3>
        <p>{Branch}</p>
        <p>Company: {CompanyName ?? '-'}</p>
        <p>Location: {CompanyLocation ?? '-'}</p>
        <p>Role: {Designation ?? '-'}</p>
        <p>Package: {Package ?? '-'}</p>
        {handleSelection && (
          <Button
            className='select-button'
            onClick={() => {
              handleSelection(data)
            }}>
            {selected ? 'Deselect' : 'Select'}
          </Button>
        )}
      </div>
      {actionOptions && (
        <div className='card-action'>
          <CardActionCell
            rowData={data}
            dataKey='action'
            onAction={onAction}
            actionOptions={actionOptions}
          />
        </div>
      )}
    </div>
  )
}

export default Card
