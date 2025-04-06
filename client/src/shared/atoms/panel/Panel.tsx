import { FC } from 'react'
import { Panel as SuitePanel, PanelProps } from 'rsuite'
import './panel.scss'

interface Props extends PanelProps {
  title?: string
}
const Panel: FC<Props> = ({ title, children, ...props }: Props) => {
  const header = <span className='panel__header'>{title}</span>
  return (
    <SuitePanel className='panel' bordered header={title && header} {...props}>
      {children}
    </SuitePanel>
  )
}
export default Panel
