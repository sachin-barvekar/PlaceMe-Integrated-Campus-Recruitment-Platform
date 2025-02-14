import { Field } from 'formik'
import { FormikInputs } from './interfaces'

function Checkbox<V>(props: Readonly<FormikInputs<V>>): React.ReactElement {
  const { name, isDisabled } = props
  return (
    <Field
      type="checkbox"
      name={name}
      data-testid={name}
      disabled={isDisabled}
    />
  )
}

export default Checkbox
