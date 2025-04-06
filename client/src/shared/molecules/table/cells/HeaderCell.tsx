import { FC, ReactNode } from 'react'
import { HeaderCell as RsuiteHeaderCell } from 'rsuite-table'

type Props = {
  children?: ReactNode
}

const HeaderCell: FC<Props> = ({ children = null, ...props }) => {
  return <RsuiteHeaderCell {...props}>{children}</RsuiteHeaderCell>
}

export default HeaderCell
