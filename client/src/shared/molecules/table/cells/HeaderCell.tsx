import { FC, ReactNode } from 'react'
import { HeaderCell as RsuiteHeaderCell } from 'rsuite-table'

type Props = {
  children?: ReactNode
}

const HeaderCell: FC<Props> = ({ children, ...props }: Props) => {
  return <RsuiteHeaderCell {...props}>{children}</RsuiteHeaderCell>
}

HeaderCell.defaultProps = {
  children: null
}

export default HeaderCell
