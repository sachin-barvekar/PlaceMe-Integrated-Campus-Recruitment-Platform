import { FC } from 'react'
import { SelectPicker, SelectPickerProps } from 'rsuite'
import './selectDropdown.scss'

interface Props extends SelectPickerProps<any> {
  lighter?: boolean;
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
