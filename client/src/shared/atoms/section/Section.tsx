import { FC } from 'react'
import Divider from '../divider/Divider'

type Props = {
  title: string | React.ReactNode
  children: React.ReactNode
}
const Section: FC<Props> = ({ title, children }: Props) => {
  return (
    <div className='section'>
      <div className='section__heading'>
        {title}
        <Divider className='divider' />
      </div>
      {children}
    </div>
  )
}

export default Section
