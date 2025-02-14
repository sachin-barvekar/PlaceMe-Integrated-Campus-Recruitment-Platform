import React from 'react'
import { Cell } from 'rsuite-table'
import { Whisper, Tooltip } from 'rsuite'

type LocationCellProps = {
  rowData?: any,
  onCellClick?: (rowData: any) => void | undefined
}

const LocationCell: React.FC<LocationCellProps> = ({
  rowData,
  onCellClick,
  ...props
}) => {
  const location = rowData?.address ?? null
  return (
    <div>
      {location ? (
        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={<Tooltip>{location}</Tooltip>}
        >
          <Cell
            onClick={() => {
              if (onCellClick) {
                onCellClick(rowData)
              }
            }}
            {...props}
          >
            <div style={{ cursor: 'pointer' }}>{location}</div>
          </Cell>
        </Whisper>
      ) : (
        <Cell {...props}>
          <div>-</div>
        </Cell>
      )}
    </div>
  )
}

export default LocationCell
