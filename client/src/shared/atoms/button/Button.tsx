import { FC } from 'react'
import { Button as RsuiteButton, ButtonProps } from 'rsuite'
import './button.scss'

const Button: FC<ButtonProps> = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <RsuiteButton
      {...props}
      className={className ? `button ${className}` : 'button'}
    >
      {children}
    </RsuiteButton>
  )
}

export default Button
