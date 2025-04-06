import React, { useMemo } from 'react'
import { ButtonToolbar, Col, DatePicker } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import '../../../../scss/common/forms/Form.scss'
import { Job } from '../../types'
import { useCreateJobMutation, useUpdateJobMutation } from '../../jobApiSlice'
import { isBefore, subDays } from 'date-fns'
import { notifyError, notifySuccess } from '../../../../utils'
import {
  defaultJobFormValues,
  getInitialJobFormValueFromResponse,
  IJobForm,
  JOB_FORM_FIELDS,
  JOB_TYPE_OPTION,
  jobValidationSchema,
} from '../../utils'
import {
  Button,
  FormikErrorMessage,
  Row,
  Section,
  TextInput,
  Modal,
  SelectDropdown,
  Panel,
} from '../../../../shared'

type Props = {
  isOpen: boolean
  onClose: () => void
  jobData?: Job | undefined
  isEditMode: boolean
}

const CreateEditJob: React.FC<Props> = ({
  isOpen,
  onClose,
  jobData,
  isEditMode,
}) => {
  const {
    ROLE,
    LOCATION,
    PACKAGE,
    JOB_TYPE: JOB_TYPE_FIELD,
    JOB_DESCRIPTION,
    SKILLS_REQUIRED,
    ELIGIBILITY_CRITERIA,
    LAST_DATE_TO_APPLY,
    DRIVE_DATE,
  } = JOB_FORM_FIELDS

  const [createJob] = useCreateJobMutation()
  const [editJob] = useUpdateJobMutation()

  const initialValues = useMemo(() => {
    return jobData
      ? getInitialJobFormValueFromResponse(jobData)
      : defaultJobFormValues
  }, [jobData])

  const onSubmit = async (
    formValues: IJobForm,
    { setSubmitting }: FormikHelpers<IJobForm>,
  ) => {
    const job: Job = {
      _id: jobData?._id ?? undefined,
      role: formValues.role,
      jobDescription: formValues.jobDescription,
      location: formValues.location,
      jobType: formValues.jobType,
      package: formValues.package,
      skillsRequired: formValues.skillsRequired,
      eligibilityCriteria: formValues.eligibilityCriteria,
      lastDateToApply: formValues.lastDateToApply,
      driveDate: formValues.driveDate,
    }

    try {
      if (jobData) {
        await editJob(job)
        notifySuccess('Job updated successfully!')
      } else {
        await createJob(job)
        notifySuccess('Job created successfully!')
      }
      onClose()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifyError('Failed to save job')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IJobForm>) => (
    <ButtonToolbar>
      <Button
        className='formButton'
        id='reset'
        onClick={() => formikProps.resetForm()}>
        Reset
      </Button>
      <Button
        className='formButton'
        type='submit'
        appearance='primary'
        disabled={formikProps.isSubmitting}>
        {isEditMode ? 'Save Changes' : 'Save'}
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Job Details' : 'Add Job Details'}
      size='lg'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={jobValidationSchema}
          enableReinitialize
          onSubmit={onSubmit}>
          {(formikProps: FormikProps<IJobForm>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='Job Details'>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={ROLE}
                        placeholder='Job Role'
                      />
                      <FormikErrorMessage name={ROLE} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={LOCATION}
                        placeholder='Location'
                      />
                      <FormikErrorMessage name={LOCATION} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={PACKAGE}
                        placeholder='Package'
                      />
                      <FormikErrorMessage name={PACKAGE} />
                    </Col>
                    <Col xs={12}>
                      <SelectDropdown
                        searchable={false}
                        name={JOB_TYPE_FIELD}
                        data={Object.values(JOB_TYPE_OPTION).map(type => ({
                          label: type,
                          value: type,
                        }))}
                        placeholder='Select Job Type'
                        value={formikProps.values[JOB_TYPE_FIELD]}
                        onChange={value =>
                          formikProps.setFieldValue(JOB_TYPE_FIELD, value)
                        }
                      />
                      <FormikErrorMessage name={JOB_TYPE_FIELD} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        as='textarea'
                        formik={formikProps}
                        name={JOB_DESCRIPTION}
                        placeholder='Job Description'
                        rows={5}
                      />
                      <FormikErrorMessage name={JOB_DESCRIPTION} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        as='textarea'
                        formik={formikProps}
                        name={SKILLS_REQUIRED}
                        placeholder='Skills Required'
                        rows={5}
                      />
                      <FormikErrorMessage name={SKILLS_REQUIRED} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} md={12}>
                      <TextInput
                        as='textarea'
                        formik={formikProps}
                        name={ELIGIBILITY_CRITERIA}
                        placeholder='Eligibility Criteria'
                        rows={5}
                      />
                      <FormikErrorMessage name={ELIGIBILITY_CRITERIA} />
                    </Col>
                  </Row>
                </Section>
                <Section title='Dates'>
                  <Row>
                    <Col xs={12}>
                      <DatePicker
                        name={DRIVE_DATE}
                        format='dd/ MMM/ yyyy'
                        value={
                          formikProps.values[DRIVE_DATE]
                            ? new Date(formikProps.values[DRIVE_DATE] as string)
                            : null
                        }
                        onChange={date =>
                          formikProps.setFieldValue(DRIVE_DATE, date)
                        }
                        placeholder='Drive Date'
                        oneTap
                        shouldDisableDate={date =>
                          isBefore(date, subDays(new Date(), 1))
                        }
                      />
                      <FormikErrorMessage name={DRIVE_DATE} />
                    </Col>
                    <Col xs={12}>
                      <DatePicker
                        name={LAST_DATE_TO_APPLY}
                        format='dd/ MMM/ yyyy'
                        value={
                          formikProps.values[LAST_DATE_TO_APPLY]
                            ? new Date(
                                formikProps.values[
                                  LAST_DATE_TO_APPLY
                                ] as string,
                              )
                            : null
                        }
                        onChange={date =>
                          formikProps.setFieldValue(LAST_DATE_TO_APPLY, date)
                        }
                        placeholder='Last Date to Apply'
                        oneTap
                        shouldDisableDate={date =>
                          isBefore(date, subDays(new Date(), 1))
                        }
                      />
                      <FormikErrorMessage name={LAST_DATE_TO_APPLY} />
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

export default CreateEditJob
