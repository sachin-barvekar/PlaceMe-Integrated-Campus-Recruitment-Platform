import { Whisper, Tooltip } from 'rsuite'
import { Cell as RsuiteCell, RowDataType, RowKeyType } from 'rsuite-table'
import { InnerCellProps } from 'rsuite-table/lib/Cell'

type CellProps<
  R extends RowDataType<any>,
  K extends RowKeyType
> = InnerCellProps<R, K> & {
  dataKey: string,
  rowData?: R,
  tooltip?: boolean
}

const Cell = <R extends RowDataType<any>, K extends RowKeyType>({
  dataKey,
  rowData,
  tooltip,
  ...props
}: CellProps<R, K>): JSX.Element => {
  const cellContent = rowData?.[dataKey]
  const displayContent =
    cellContent === null || cellContent === undefined ? '-' : cellContent

  if (tooltip && cellContent) {
    return (
      <Whisper
        placement="bottom"
        trigger="hover"
        speaker={<Tooltip>{cellContent}</Tooltip>}
      >
        <RsuiteCell {...props} style={{ cursor: 'pointer' }}>
          {cellContent}
        </RsuiteCell>
      </Whisper>
    )
  }
  return <RsuiteCell {...props}>{displayContent}</RsuiteCell>
}

export default Cell
