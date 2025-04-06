import React, { useEffect, useMemo, useState } from 'react'
import { ButtonToolbar, Col } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import '../../../../scss/common/forms/Form.scss'
import {
  useCreateRecruiterProfileMutation,
  useUpdateRecruiterProfileMutation,
} from '../../profileApiSlice'
import { RecruiterProfileResponse } from '../../types'
import {
  RECRUITER_PROFILE_FIELDS,
  defaultRecruiterProfileValues,
  getInitialRecruiterProfileFromResponse,
  IRecruiterProfile,
  recruiterProfileValidationSchema,
} from '../../utils'
import {
  Button,
  FormikErrorMessage,
  Row,
  Section,
  TextInput,
  Modal,
  Panel,
  Uploader,
} from '../../../../shared'
import {
  isFileObject,
  notifyError,
  notifySuccess,
  previewFile,
} from '../../../../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  profileData: RecruiterProfileResponse | undefined
  isEditMode: boolean
}

const CreateEditRecruiterProfile: React.FC<Props> = ({
  isOpen,
  onClose,
  profileData,
  isEditMode,
}) => {
  const {
    COMPANY_NAME,
    ABOUT_US,
    COMPANY_WEBSITE,
    LINKEDIN,
    PROFILE_PHOTO,
    ADDRESS,
  } = RECRUITER_PROFILE_FIELDS

  const initialValues = useMemo(
    () =>
      profileData
        ? getInitialRecruiterProfileFromResponse(profileData)
        : defaultRecruiterProfileValues,
    [profileData],
  )

  const [createRecruiterProfile] = useCreateRecruiterProfileMutation()
  const [editRecruiterProfile] = useUpdateRecruiterProfileMutation()
  const [fileInfo, setFileInfo] = useState<string | undefined>(undefined)
  const maxSize = 2 * 1024 * 1024

  useEffect(() => {
    if (profileData?.recruiter?.profilePhoto) {
      setFileInfo(profileData.recruiter.profilePhoto)
    }
  }, [profileData?.recruiter?.profilePhoto])

  const onSubmit = async (
    formValues: IRecruiterProfile,
    { setSubmitting }: FormikHelpers<IRecruiterProfile>,
  ) => {
    const recruiterDTO = {
      companyName: formValues.companyName,
      aboutUs: formValues.aboutUs,
      companyWebsite: formValues.companyWebsite,
      linkedIn: formValues.linkedIn,
      address: formValues.address,
    }

    const fileObject = formValues[PROFILE_PHOTO]
    let file: File | null = null

    if (fileObject) {
      if (isFileObject(fileObject)) {
        file = fileObject.blobFile
      } else if (typeof fileObject !== 'string') {
        file = fileObject
      }
    }

    try {
      if (profileData) {
        await editRecruiterProfile({ recruiterDTO, file })
        notifySuccess('Profile Updated successfully!')
      } else {
        await createRecruiterProfile({ recruiterDTO, file })
        notifySuccess('Profile Created successfully!')
      }
      onClose()
      setFileInfo(undefined)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifyError('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }
  const renderFormButtons = (formikProps: FormikProps<IRecruiterProfile>) => (
    <ButtonToolbar>
      {isEditMode ? (
        <>
          <Button
            className='formButton'
            id='reset'
            onClick={() => {
              setFileInfo(profileData?.recruiter?.profilePhoto ?? undefined)
              formikProps.resetForm()
            }}>
            Reset
          </Button>
          <Button
            className='formButton'
            type='submit'
            appearance='primary'
            disabled={formikProps.isValidating || formikProps.isSubmitting}>
            Save changes
          </Button>
        </>
      ) : (
        <>
          <Button
            className='formButton'
            id='reset'
            onClick={() => {
              setFileInfo(undefined)
              formikProps.resetForm()
            }}>
            Reset
          </Button>
          <Button
            className='formButton'
            appearance='primary'
            type='submit'
            disabled={formikProps.isValidating || formikProps.isSubmitting}>
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
      title={isEditMode ? 'Edit Recruiter Profile' : 'Create Recruiter Profile'}
      size='lg'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={recruiterProfileValidationSchema}
          enableReinitialize
          onSubmit={onSubmit}>
          {(formikProps: FormikProps<IRecruiterProfile>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='Company Details'>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={COMPANY_NAME}
                        placeholder='Company Name'
                      />
                      <FormikErrorMessage name={COMPANY_NAME} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={COMPANY_WEBSITE}
                        placeholder='Company Website'
                      />
                      <FormikErrorMessage name={COMPANY_WEBSITE} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={LINKEDIN}
                        placeholder='LinkedIn URL'
                      />
                      <FormikErrorMessage name={LINKEDIN} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={ADDRESS}
                        placeholder='Company Address'
                      />
                      <FormikErrorMessage name={ADDRESS} />
                    </Col>
                  </Row>
                </Section>
                <Section title='About Us'>
                  <Row>
                    <Col xs={24} md={12}>
                      <TextInput
                        formik={formikProps}
                        name={ABOUT_US}
                        rows={5}
                        placeholder='Enter company about us'
                        as='textarea'
                      />
                      <FormikErrorMessage name={ABOUT_US} />
                    </Col>
                  </Row>
                </Section>
                <Section title='Profile Photo'>
                  <Row>
                    <Col md={8} xs={24}>
                      <Uploader
                        draggable
                        accept='.jpeg,.jpg,.png,.gif,.svg'
                        listType='picture'
                        action='http://localhost:3000/post'
                        fileInfo={fileInfo}
                        onChange={fileList => {
                          if (fileList.length > 0) {
                            const file = fileList[fileList.length - 1]
                            if (file.blobFile && file.blobFile.size > maxSize) {
                              notifyError('File size must be less than 2 MB')
                              fileList.pop()
                              formikProps.setFieldValue(PROFILE_PHOTO, null)
                            } else {
                              previewFile(file.blobFile, value =>
                                setFileInfo(value),
                              )
                              fileList.splice(0, fileList.length - 1)
                              formikProps.setFieldValue(PROFILE_PHOTO, file)
                            }
                          } else {
                            formikProps.setFieldValue(PROFILE_PHOTO, null)
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
      }
    />
  )
}

export default CreateEditRecruiterProfile
