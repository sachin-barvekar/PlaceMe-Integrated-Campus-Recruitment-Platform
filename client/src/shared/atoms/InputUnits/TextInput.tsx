import { Input } from 'rsuite'
import { FormikInputs } from './interfaces'

function TextInput<V>(props: Readonly<FormikInputs<V>>): React.ReactElement {
  const {
    formik,
    dataType = 'string',
    placeholder = '',
    isDisabled,
    name,
    rows,
    ...rest
  } = props

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldValue = (formik?.values as Record<string, any>)[name] ?? ''

  return (
    <Input
      name={name}
      data-testid={name}
      type={dataType}
      rows={rows}
      value={
        typeof fieldValue === 'string' || typeof fieldValue === 'number'
          ? fieldValue
          : ''
      }
      disabled={isDisabled}
      placeholder={placeholder}
      onChange={(value: string) => {
        formik?.setFieldValue(name, value)
      }}
      {...rest}
    />
  )
}

export default TextInput
