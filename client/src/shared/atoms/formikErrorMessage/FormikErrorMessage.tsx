/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage, useFormikContext } from 'formik'
import { FC, JSX } from 'react'
import { Message } from 'rsuite'
import './formikErrorMessage.scss'

type Props = {
  name: string
}

const FormikErrorMessage: FC<Props> = ({ name }) => {
  const formikContext = useFormikContext()

  if (!formikContext) {
    return null
  }

  const renderFormError = (errorMessage: any): JSX.Element | null => {
    if (Array.isArray(errorMessage) && errorMessage.length > 0) {
      const errorValues = errorMessage
        .map((err: any) => {
          if (err && typeof err === 'object') {
            return Object.values(err).join(', ')
          }
          return ''
        })
        .filter((value: string) => value)
        .join(', ')

      return (
        <Message type='error' showIcon>
          {errorValues}
        </Message>
      )
    }

    return errorMessage ? (
      <Message type='error' showIcon>
        {errorMessage}
      </Message>
    ) : null
  }

  return (
    <div role='alert' aria-live='polite'>
      <ErrorMessage name={name} render={renderFormError} />
    </div>
  )
}

export default FormikErrorMessage
