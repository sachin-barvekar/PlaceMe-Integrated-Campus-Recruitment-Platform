import React, { useEffect, useMemo, useState } from 'react'
import { ButtonToolbar, Col } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import '../../../../scss/common/forms/Form.scss'
import { AdminProfile, AdminProfileResponse } from '../../types'
import {
  useCreateAdminProfileMutation,
  useUpdateAdminProfileMutation,
} from '../../profileApiSlice'
import {
  ADMIN_PROFILE_FIELDS,
  genderOptions,
  positionOptions,
  adminProfileValidationSchema,
  IAdminProfile,
  getInitialAdminProfileFromResponse,
  defaultAdminProfileValues,
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
  profileData: AdminProfileResponse | undefined
  isEditMode: boolean
}

const CreateEditAdminProfile: React.FC<Props> = ({
  isOpen,
  onClose,
  profileData,
  isEditMode,
}) => {
  const {
    GENDER,
    MOBILE,
    POSITION,
    LINKEDIN,
    COLLEGE_NAME,
    COLLEGE_ADDRESS,
    PROFILE_PHOTO,
  } = ADMIN_PROFILE_FIELDS

  const initialValues = useMemo(
    () =>
      profileData
        ? getInitialAdminProfileFromResponse(profileData)
        : defaultAdminProfileValues,
    [profileData],
  )

  const [createAdminProfile] = useCreateAdminProfileMutation()
  const [editAdminProfile] = useUpdateAdminProfileMutation()
  const [fileInfo, setFileInfo] = useState<string | undefined>(undefined)
  const maxSize = 2 * 1024 * 1024

  useEffect(() => {
    if (profileData?.admin?.profilePhoto) {
      setFileInfo(profileData?.admin?.profilePhoto)
    }
  }, [profileData?.admin?.profilePhoto])

  const onSubmit = async (
    formValues: IAdminProfile,
    { setSubmitting }: FormikHelpers<IAdminProfile>,
  ) => {
    const adminDTO: AdminProfile = {
      gender: formValues.gender,
      mobile: formValues.mobile,
      linkedIn: formValues.linkedIn,
      position: formValues.position,
      collegeName: formValues.collegeName,
      collegeAddress: formValues.collegeAddress,
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
        await editAdminProfile({ adminDTO, file })
        notifySuccess('Profile Updated successfully!')
      } else {
        await createAdminProfile({ adminDTO, file })
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

  const renderFormButtons = (formikProps: FormikProps<IAdminProfile>) => (
    <ButtonToolbar>
      {isEditMode ? (
        <>
          <Button
            className='formButton'
            id='reset'
            onClick={() => {
              setFileInfo(profileData?.admin?.profilePhoto ?? undefined)
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
      title={isEditMode ? 'Edit Admin Profile' : 'Create Admin Profile'}
      size='lg'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={adminProfileValidationSchema}
          enableReinitialize
          onSubmit={onSubmit}>
          {(formikProps: FormikProps<IAdminProfile>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='Personal Details'>
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={GENDER}
                        data={genderOptions}
                        searchable={false}
                        placeholder='Select Gender'
                        value={formikProps.values[GENDER]}
                        onChange={value =>
                          formikProps.setFieldValue(GENDER, value)
                        }
                      />
                      <FormikErrorMessage name={GENDER} />
                    </Col>

                    <Col xs={12}>
                      <PhoneInput
                        placeholder='Mobile Number'
                        country='in'
                        value={formikProps.values[MOBILE]}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(value: any) =>
                          formikProps.setFieldValue(MOBILE, value)
                        }
                        inputProps={{
                          name: MOBILE,
                        }}
                      />
                      <FormikErrorMessage name={MOBILE} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={POSITION}
                        data={positionOptions}
                        searchable={false}
                        placeholder='Select Position'
                        value={formikProps.values[POSITION]}
                        onChange={value =>
                          formikProps.setFieldValue(POSITION, value)
                        }
                      />
                      <FormikErrorMessage name={POSITION} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={LINKEDIN}
                        placeholder='LinkedIn URL'
                      />
                      <FormikErrorMessage name={LINKEDIN} />
                    </Col>
                  </Row>
                </Section>
                <Section title='College Details'>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={COLLEGE_NAME}
                        placeholder='College Name'
                      />
                      <FormikErrorMessage name={COLLEGE_NAME} />
                    </Col>

                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={COLLEGE_ADDRESS}
                        placeholder='College Address'
                      />
                      <FormikErrorMessage name={COLLEGE_ADDRESS} />
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
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              previewFile(file.blobFile, (value: any) => {
                                setFileInfo(value)
                              })
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
                <div className='form-button'>
                  {renderFormButtons(formikProps)}
                </div>
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default CreateEditAdminProfile
