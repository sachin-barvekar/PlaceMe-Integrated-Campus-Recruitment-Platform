import { Field } from 'formik'
import { FormikSelectInputs } from './interfaces'

function Select<V>(props: Readonly<FormikSelectInputs<V>>): React.ReactElement {
  const { formik, name, inputProps } = props
  const items =
    inputProps?.selectOptions ||
    inputProps?.allowedValue?.map((value) => {
      return {
        label: value,
        value
      }
    }) ||
    []

  return (
    <Field
      as="select"
      name={name}
      data-testid={name}
      disabled={inputProps?.isDisabled}
      value={(formik?.values as Record<string, any>)[name] || ''}
      onChange={(e: React.ChangeEvent<any>) => {
        formik?.setFieldValue(name, e?.target?.value)
      }}
    >
      <option key="Select" value="">
        Select
      </option>
      {items.map((entry) => {
        return (
          <option key={entry.value} value={entry.value}>
            {entry?.label}
          </option>
        )
      })}
    </Field>
  )
}

export default Select
