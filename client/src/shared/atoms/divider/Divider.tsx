import { FC } from 'react'
import { Divider as SuiteDivider } from 'rsuite'

type DividerProps = {
  className?: string
}
const Divider: FC<DividerProps> = ({ className }: DividerProps) => {
  return <SuiteDivider className={className} />
}

export default Divider
