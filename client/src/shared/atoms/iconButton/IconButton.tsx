import { FC } from 'react'
import { IconButton as RSuiteIconButton, IconButtonProps } from 'rsuite'
import './iconButton.scss'

interface Props extends IconButtonProps {
  lighter?: boolean;
}

const IconButton: FC<Props> = ({
  children,
  className,
  lighter,
  ...props
}: Props) => {
  const lighterClass = lighter ? 'lighter' : ''
  return (
    <RSuiteIconButton
      className={`icon-button ${className ?? ''} ${lighterClass}`}
      {...props}
    >
      {children}
    </RSuiteIconButton>
  )
}

export default IconButton
