import { FC } from 'react'
import { SelectPicker, SelectPickerProps } from 'rsuite'
import './selectDropdown.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props extends SelectPickerProps<any> {
  lighter?: boolean
}

const SelectDropdown: FC<Props> = ({ className, lighter, ...props }: Props) => {
  const lighterClass = lighter ? 'lighter' : ''
  return (
    <SelectPicker
      className={`select-picker ${className ?? ''} ${lighterClass}`}
      {...props}
    />
  )
}

export default SelectDropdown
