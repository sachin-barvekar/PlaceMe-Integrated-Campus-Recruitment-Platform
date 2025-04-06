import { DatePicker } from 'rsuite'
import { format } from 'date-fns'
import { FormikInputs } from './interfaces'

function DateInput<V>(props: Readonly<FormikInputs<V>>): React.ReactElement {
  const { formik, name, isDisabled } = props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateValue = (formik?.values as Record<string, any>)[name]

  return (
    <DatePicker
      value={dateValue ? new Date(dateValue) : null}
      onChange={val => {
        const formattedDate = val ? format(val, 'yyyy-MM-dd') : ''
        formik?.setFieldValue(name, formattedDate)
      }}
      oneTap
      block
      disabled={isDisabled}
    />
  )
}

export default DateInput
