import { ErrorMessage, useFormikContext } from 'formik'
import { FC } from 'react'
import { Form } from 'rsuite'
import './formikErrorMessage.scss'

type Props = {
  name: string
}
const FormikErrorMessage: FC<Props> = ({ name }: Props) => {
  const formikContext = useFormikContext()

  if (!formikContext) {
    return null
  }

  const renderFormError = (errorMessage: string) => (
    <Form.ErrorMessage show={!!errorMessage} placement="bottomStart">
      {errorMessage}
    </Form.ErrorMessage>
  )

  return (
    <div>
      <ErrorMessage name={name} render={renderFormError} />
    </div>
  )
}
export default FormikErrorMessage
