import React, { useMemo } from 'react'
import { ButtonToolbar, Col } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import '../../../../scss/common/forms/Form.scss'
import { Placement } from 'pages/placeStudents/types'
import { useFetchStudentsListQuery } from 'pages/students/studentListApiSlice'
import {
  useCreatePlacementMutation,
  useUpdatePlacementMutation
} from 'pages/placeStudents/placeStudentApiSlice'
import { IListApiRequest } from 'api/types'
import { useTableHandlers } from 'hooks/useTableHandlers'
import { Students } from 'pages/students/types'
import { notifyError, notifySuccess } from '../../../../utils'
import {
  defaultPlacementFormValues,
  getInitialPlacementFormValueFromResponse,
  IPlacementForm,
  PLACEMENT_FORM_FIELDS,
  placementValidationSchema
} from '../../utils'

import {
  Button,
  FormikErrorMessage,
  Row,
  Section,
  TextInput,
  Modal,
  SelectDropdown,
  Panel
} from '../../../../shared'

type Props = {
  isOpen: boolean,
  onClose: () => void,
  placementData?: Placement | undefined,
  isEditMode: boolean
}

const CreateEditPlacement: React.FC<Props> = ({
  isOpen,
  onClose,
  placementData,
  isEditMode
}) => {
  const {
    STUDENT_NAME,
    COMPANY_ID,
    COMPANY_NAME,
    JOB_ROLE,
    LOCATION,
    PACKAGE
  } = PLACEMENT_FORM_FIELDS

  const { requestBody } = useTableHandlers<Students, IListApiRequest<Students>>(
    {
      page: { size: Number.MAX_SAFE_INTEGER, number: 0 },
      filters: []
    }
  )
  const { data } = useFetchStudentsListQuery(requestBody)

  const studentData =
    data?.content?.map((student) => ({
      label: student.userId.name,
      // eslint-disable-next-line
      value: student?.userId._id
    })) || []

  const [createPlacement] = useCreatePlacementMutation()
  const [editPlacement] = useUpdatePlacementMutation()

  const initialValues = useMemo(() => {
    const values = placementData
      ? getInitialPlacementFormValueFromResponse(placementData)
      : defaultPlacementFormValues
    return values
  }, [placementData])
  const onSubmit = async (
    formValues: IPlacementForm,
    { setSubmitting }: FormikHelpers<IPlacementForm>
  ) => {
    const placementDTO: Placement = {
      // eslint-disable-next-line
      _id: placementData?._id ?? undefined,
      companyName: formValues.companyName ?? '',
      jobRole: formValues.jobRole ?? '',
      package: formValues.package ?? '',
      location: formValues.location ?? '',
      studentId: formValues.studentId ?? '',
      companyId:
        formValues.companyID === 'other' ? undefined : formValues.companyID,
      status: 'Placed'
    }

    try {
      if (placementData) {
        await editPlacement({ placementDTO })
        notifySuccess('Student Placement Updated successfully!')
      } else {
        await createPlacement({ placementDTO })
        notifySuccess('Student Placement Created successfully!')
      }
      onClose()
    } catch (error) {
      notifyError('Failed to update placement')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IPlacementForm>) => (
    <ButtonToolbar>
      {isEditMode ? (
        <>
          <Button
            className="formButton"
            id="reset"
            onClick={() => {
              formikProps.resetForm()
            }}
          >
            Reset
          </Button>
          <Button
            className="formButton"
            type="submit"
            appearance="primary"
            disabled={formikProps.isValidating || formikProps.isSubmitting}
          >
            Save changes
          </Button>
        </>
      ) : (
        <>
          <Button
            className="formButton"
            id="reset"
            onClick={() => {
              formikProps.resetForm()
            }}
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
        </>
      )}
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Placement Details' : 'Add Placement Details'}
      size="lg"
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={placementValidationSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(formikProps: FormikProps<IPlacementForm>) => (
            <Form className="create-edit-form">
              <Panel bordered={false}>
                <Section title="Details">
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={STUDENT_NAME}
                        data={studentData ?? []}
                        placeholder="Select Student"
                        value={formikProps.values[STUDENT_NAME]}
                        onChange={(value) =>
                          formikProps.setFieldValue(STUDENT_NAME, value)
                        }
                        disabled={isEditMode}
                      />
                      <FormikErrorMessage name={STUDENT_NAME} />
                    </Col>
                    <Col xs={12}>
                      <SelectDropdown
                        name={COMPANY_ID}
                        data={[
                          { label: 'Company A', value: 'CompanyA' },
                          { label: 'Other', value: 'other' }
                        ]}
                        placeholder="Select Company"
                        value={formikProps.values[COMPANY_ID]}
                        onChange={(value) =>
                          formikProps.setFieldValue(COMPANY_ID, value)
                        }
                      />
                      <FormikErrorMessage name={COMPANY_ID} />
                    </Col>
                  </Row>
                  {formikProps.values[COMPANY_ID] === 'other' && (
                    <Row>
                      <Col xs={12}>
                        <TextInput
                          formik={formikProps}
                          name={COMPANY_NAME}
                          placeholder="Company Name"
                        />
                        <FormikErrorMessage name={COMPANY_NAME} />
                      </Col>
                    </Row>
                  )}
                </Section>
                <Section title="Job Description">
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={JOB_ROLE}
                        placeholder="Job Role"
                      />
                      <FormikErrorMessage name={JOB_ROLE} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={PACKAGE}
                        placeholder="Package"
                      />
                      <FormikErrorMessage name={PACKAGE} />
                    </Col>
                  </Row>
                  <Row>
                    {' '}
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={LOCATION}
                        placeholder="location"
                      />
                      <FormikErrorMessage name={LOCATION} />
                    </Col>
                  </Row>
                </Section>
                {renderFormButtons(formikProps)}
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default CreateEditPlacement
