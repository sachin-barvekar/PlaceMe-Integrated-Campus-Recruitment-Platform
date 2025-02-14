import React, { useMemo } from 'react'
import { ButtonToolbar, Col } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import { notifyError, notifySuccess } from 'utils'

import {
  Button,
  FormikErrorMessage,
  Row,
  Section,
  TextInput,
  Modal,
  Panel,
  Uploader
} from 'shared'
import '../../../scss/common/forms/Form.scss'
import {
  RECRUITER_FORM_FIELDS,
  defaultRecruiterFormValues,
  IRecruiterForm,
  recruiterValidationSchema
} from '../utils'

type Props = {
  isOpen: boolean,
  onClose: () => void
}

const AddRecruiter: React.FC<Props> = ({ isOpen, onClose }) => {
  const { NAME, WEBSITE, EMAIL, PHONE, ADDRESS, PASSWORD, PROFILE_PHOTO } =
    RECRUITER_FORM_FIELDS

  const initialValues = useMemo(() => defaultRecruiterFormValues, [])

  const onSubmit = async (
    formValues: IRecruiterForm,
    { setSubmitting }: FormikHelpers<IRecruiterForm>
  ) => {
    // const RecruiterDTO = {
    //   name: formValues.name,
    //   website: formValues.website,
    //   email: formValues.email,
    //   phone: formValues.phone,
    //   address: formValues.address,
    //   password: formValues.password
    // }

    // const fileObject = formValues[PROFILE_PHOTO]
    // let file: File | null = null

    // if (fileObject) {
    //   if (isFileObject(fileObject)) {
    //     file = fileObject.blobFile
    //   } else if (typeof fileObject !== 'string') {
    //     file = fileObject
    //   }
    // }

    try {
      // Make API call here to save the recruiter data
      notifySuccess('Recruiter added successfully!')
    } catch (error) {
      notifyError('Failed to add recruiter')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IRecruiterForm>) => (
    <ButtonToolbar>
      <Button
        className="formButton"
        id="reset"
        onClick={() => formikProps.resetForm()}
      >
        Reset
      </Button>
      <Button
        className="formButton"
        appearance="primary"
        type="submit"
        disabled={formikProps.isValidating || formikProps.isSubmitting}
      >
        Add Recruiter
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title="Add Recruiter"
      size="sm"
      body={
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={recruiterValidationSchema}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {(formikProps: FormikProps<IRecruiterForm>) => (
              <Form className="commonForm">
                <Panel bordered={false}>
                  <Section title="Recruiter Details">
                    <Row>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={NAME}
                          placeholder="Name"
                          dataType="string"
                        />
                        <FormikErrorMessage name={NAME} />
                      </Col>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={WEBSITE}
                          placeholder="Website"
                          dataType="string"
                        />
                        <FormikErrorMessage name={WEBSITE} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={EMAIL}
                          placeholder="Email"
                          dataType="string"
                        />
                        <FormikErrorMessage name={EMAIL} />
                      </Col>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={PHONE}
                          placeholder="Phone Number"
                          dataType="string"
                        />
                        <FormikErrorMessage name={PHONE} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={ADDRESS}
                          placeholder="Address"
                          dataType="string"
                        />
                        <FormikErrorMessage name={ADDRESS} />
                      </Col>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={PASSWORD}
                          placeholder="Password"
                          dataType="password"
                        />
                        <FormikErrorMessage name={PASSWORD} />
                      </Col>
                    </Row>
                  </Section>
                  <Section title="Profile Photo">
                    <Row>
                      <Col xs={24}>
                        <Uploader
                          draggable
                          listType="picture"
                          action="http://localhost:3000/upload"
                          onChange={(fileList) => {
                            if (fileList.length > 0) {
                              const file = fileList[0]
                              formikProps.setFieldValue(PROFILE_PHOTO, file)
                            }
                          }}
                        />
                        <FormikErrorMessage name={PROFILE_PHOTO} />
                      </Col>
                    </Row>
                  </Section>
                  {renderFormButtons(formikProps)}
                </Panel>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  )
}

export default AddRecruiter
