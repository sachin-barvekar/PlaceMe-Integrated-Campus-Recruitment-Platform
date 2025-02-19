import React, { useMemo, useState } from 'react'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import {
  Modal,
  Button,
  TextInput,
  FormikErrorMessage,
  Panel,
  Row,
  Section
} from 'shared'
import { notifyError, notifySuccess } from 'utils'
import * as Yup from 'yup'
import { ButtonToolbar, Col, InputGroup } from 'rsuite'
import './passkey.scss'
import EyeCloseIcon from '@rsuite/icons/EyeClose'
import EyeRoundIcon from '@rsuite/icons/EyeRound'

interface PasskeyModalProps {
  isOpen: boolean;
  role: string | null | undefined;
  onClose: () => void;
  onVerify: (passkey: string) => void;
}

const PasskeyModal: React.FC<PasskeyModalProps> = ({
  isOpen,
  role,
  onClose,
  onVerify
}) => {
  const initialValues = useMemo(() => ({ passkey: '' }), [])
  const [visible, setVisible] = useState(false)

  const validationSchema = Yup.object().shape({
    passkey: Yup.string()
      .required('Passkey is required')
      .min(4, 'Passkey must be 4 digits or letters')
  })

  const onSubmit = async (
    formValues: { passkey: string },
    { setSubmitting, resetForm }: FormikHelpers<{ passkey: string }>
  ) => {
    try {
      await onVerify(formValues.passkey)
      notifySuccess(`${role} verified successfully!`)
      resetForm()
      onClose()
    } catch (error) {
      notifyError(`Failed to verify ${role}`, {
        containerId: 'modalToast'
      })
      return
    } finally {
      setSubmitting(false)
    }
  }
  const handleChange = () => {
    setVisible(!visible)
  }

  const renderFormButtons = (formikProps: any) => (
    <ButtonToolbar>
      <Button
        className="formButton"
        appearance="primary"
        type="submit"
        disabled={formikProps.isValidating || formikProps.isSubmitting}
      >
        Verify
      </Button>
      <Button
        className="formButton"
        id="reset"
        onClick={() => {
          formikProps.resetForm()
        }}
      >
        Reset
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title={`Verify Your Identity as ${role}`}
      size="xs"
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formikProps: FormikProps<{ passkey: string }>) => (
            <Form className="passkey">
              <Panel bordered={false}>
                <Section title="Secure Access Verification">
                  <Row>
                    <Col xs={24}>
                      <InputGroup inside>
                        <TextInput
                          formik={formikProps}
                          name="passkey"
                          placeholder="Enter Passkey"
                          dataType={visible ? 'string' : 'password'}
                        />
                        <InputGroup.Button onClick={handleChange}>
                          {visible ? <EyeRoundIcon /> : <EyeCloseIcon />}
                        </InputGroup.Button>
                      </InputGroup>
                      <FormikErrorMessage name="passkey" />
                    </Col>
                  </Row>
                  {renderFormButtons(formikProps)}
                </Section>
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default PasskeyModal
