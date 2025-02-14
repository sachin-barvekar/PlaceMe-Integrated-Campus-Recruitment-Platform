import React, { useMemo } from 'react'
import { ButtonToolbar, Col, DatePicker } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import { notifyError, notifySuccess } from '../../../../utils'

import {
  Button,
  FormikErrorMessage,
  Row,
  Section,
  TextInput,
  Modal,
  SelectDropdown,
  Panel,
  Uploader
} from '../../../../shared'
import '../../../../scss/common/forms/Form.scss'
import {
  STUDENT_FORM_FIELDS,
  defaultStudentFormValues,
  IStudentForm,
  studentValidationSchema,
  genderOptions
} from '../../utils'

type Props = {
  isOpen: boolean,
  onClose: () => void
}

const AddStudent: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    NAME,
    GENDER,
    MOBILE,
    EMAIL,
    DATE_OF_BIRTH,
    BRANCH,
    ADDRESS,
    PASSWORD,
    PROFILE_PHOTO
  } = STUDENT_FORM_FIELDS

  const initialValues = useMemo(() => defaultStudentFormValues, [])

  const onSubmit = async (
    formValues: IStudentForm,
    { setSubmitting }: FormikHelpers<IStudentForm>
  ) => {
    // const StudentDTO = {
    //   name: formValues.name,
    //   gender: formValues.gender,
    //   mobile: formValues.mobile,
    //   email: formValues.email,
    //   dateOfBirth: formValues.dateOfBirth,
    //   branch: formValues.branch,
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
      // Make API call here to save the student data
      notifySuccess('Student added successfully!')
    } catch (error) {
      notifyError('Failed to add student')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IStudentForm>) => (
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
        Save
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title="Add Student"
      size="sm"
      body={
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={studentValidationSchema}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {(formikProps: FormikProps<IStudentForm>) => (
              <Form className="commonForm">
                <Panel bordered={false}>
                  <Section title="Details">
                    <Row>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={NAME}
                          placeholder="Full Name"
                          dataType="string"
                        />
                        <FormikErrorMessage name={NAME} />
                      </Col>
                      <Col xs={12}>
                        <SelectDropdown
                          searchable={false}
                          name={GENDER}
                          data={genderOptions}
                          placeholder="Select Gender"
                          onChange={(value) =>
                            formikProps.setFieldValue(GENDER, value)
                          }
                          value={formikProps.values[GENDER]}
                        />
                        <FormikErrorMessage name={GENDER} />
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
                          name={MOBILE}
                          placeholder="Mobile Number"
                          dataType="string"
                        />
                        <FormikErrorMessage name={MOBILE} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <DatePicker
                          name={DATE_OF_BIRTH}
                          format="dd/ MMM/ yyyy"
                          value={formikProps.values[DATE_OF_BIRTH] || null}
                          onChange={(date: Date | null) => {
                            formikProps.setFieldValue(DATE_OF_BIRTH, date)
                          }}
                          disabled={false}
                          placeholder="Date of Birth"
                          oneTap
                        />
                        <FormikErrorMessage name={DATE_OF_BIRTH} />
                      </Col>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={BRANCH}
                          placeholder="Branch"
                          dataType="string"
                        />
                        <FormikErrorMessage name={BRANCH} />
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

export default AddStudent
