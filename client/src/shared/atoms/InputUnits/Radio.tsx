import { Radio as RsRadio, RadioGroup as RsRadioGroup } from 'rsuite'
import { FormikRadioInputs } from './interfaces'

function Radio<V>(props: Readonly<FormikRadioInputs<V>>): React.ReactElement {
  const { formik, name, inputProps } = props
  const items =
    inputProps?.allowedValue?.map((value) => {
      return {
        label: value,
        value
      }
    }) || []

  return (
    <RsRadioGroup
      name={name}
      data-testid={name}
      value={(formik?.values as Record<string, any>)[name]}
      inline
      disabled={inputProps?.isDisabled}
      onChange={(val) => {
        formik?.setFieldValue(name, val)
      }}
    >
      {items.map((entry) => {
        return (
          <RsRadio key={entry.value} value={entry.value}>
            {entry?.label}
          </RsRadio>
        )
      })}
    </RsRadioGroup>
  )
}

export default Radio
