import React, { useEffect, useMemo, useState } from 'react'
import { ButtonToolbar, Col, DatePicker, Input, SelectPicker } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps, FieldArray } from 'formik'
import PlusIcon from '@rsuite/icons/Plus'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import '../../../../scss/common/forms/Form.scss'
import { Student, StudentProfileResponse } from 'pages/profile/types'
import { MdRemoveCircle } from 'react-icons/md'
import {
  useCreateProfileMutation,
  useUpdateProfileMutation
} from 'pages/profile/profileApiSlice'
import { format, isAfter } from 'date-fns'
import {
  STUDENT_FORM_FIELDS,
  defaultStudentFormValues,
  IStudentForm,
  studentValidationSchema,
  getInitialProfileFormValueFromResponse,
  genderOptions,
  Branch,
  level
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
  Uploader
} from '../../../../shared'
import {
  isFileObject,
  notifyError,
  notifySuccess,
  previewFile
} from '../../../../utils'

type Props = {
  isOpen: boolean,
  onClose: () => void,
  profileData: StudentProfileResponse | undefined,
  isEditMode: boolean
}

const CreateEditStudentProfile: React.FC<Props> = ({
  isOpen,
  onClose,
  profileData,
  isEditMode
}) => {
  const {
    GENDER,
    MOBILE,
    DATE_OF_BIRTH,
    BRANCH,
    ADDRESS,
    PROFILE_PHOTO,
    SKILLS,
    ACADEMIC_DETAILS,
    LINKEDIN,
    GITHUB
  } = STUDENT_FORM_FIELDS

  const initialValues = useMemo(
    () =>
      profileData
        ? getInitialProfileFormValueFromResponse(profileData)
        : defaultStudentFormValues,
    [profileData]
  )
  const [createStudentProfile] = useCreateProfileMutation()
  const [editStudentProfile] = useUpdateProfileMutation()
  const [fileInfo, setFileInfo] = useState<string | undefined>(undefined)
  const maxSize = 2 * 1024 * 1024

  useEffect(() => {
    if (profileData?.student?.profilePhoto) {
      setFileInfo(profileData.student.profilePhoto)
    }
  }, [profileData?.student?.profilePhoto])

  const onSubmit = async (
    formValues: IStudentForm,
    { setSubmitting }: FormikHelpers<IStudentForm>
  ) => {
    const studentDTO: Student = {
      userId: profileData?.student?.userId ?? undefined,
      gender: formValues.gender,
      mobile: formValues.mobile,
      dateOfBirth: formValues.dateOfBirth
        ? format(new Date(formValues.dateOfBirth), 'dd/ MMM/ yyyy')
        : '',
      branch: formValues.branch,
      address: formValues.address,
      academicDetails: formValues.academicDetails,
      skills: formValues.skills,
      linkedIn: formValues.linkedIn,
      github: formValues.github
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
        await editStudentProfile({ studentDTO, file })
        notifySuccess('Profile Updated successfully!')
      } else {
        await createStudentProfile({ studentDTO, file })
        notifySuccess('Profile Created successfully!')
      }
      onClose()
      setFileInfo(undefined)
    } catch (error) {
      notifyError('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IStudentForm>) => (
    <ButtonToolbar>
      {isEditMode ? (
        <>
          <Button
            className="formButton"
            id="reset"
            onClick={() => {
              setFileInfo(profileData?.student?.profilePhoto ?? undefined)
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
              setFileInfo(undefined)
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
      title={isEditMode ? 'Edit Student Profile' : 'Create Student Profile'}
      size="lg"
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={studentValidationSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {(formikProps: FormikProps<IStudentForm>) => (
            <Form className="create-edit-form">
              <Panel bordered={false}>
                <Section title="Personal Details">
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={GENDER}
                        data={genderOptions}
                        searchable={false}
                        placeholder="Select Gender"
                        value={formikProps.values[GENDER]}
                        onChange={(value) =>
                          formikProps.setFieldValue(GENDER, value)
                        }
                      />
                      <FormikErrorMessage name={GENDER} />
                    </Col>

                    <Col xs={12}>
                      <PhoneInput
                        placeholder="Mobile Number"
                        country="in"
                        value={formikProps.values[MOBILE]}
                        onChange={(value: any) =>
                          formikProps.setFieldValue(MOBILE, value)
                        }
                        inputProps={{
                          name: MOBILE
                        }}
                      />
                      <FormikErrorMessage name={MOBILE} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <DatePicker
                        name={DATE_OF_BIRTH}
                        format="dd/ MMM/ yyyy"
                        value={
                          formikProps.values[DATE_OF_BIRTH]
                            ? new Date(
                                formikProps.values[DATE_OF_BIRTH] as string
                              )
                            : null
                        }
                        onChange={(date) =>
                          formikProps.setFieldValue(DATE_OF_BIRTH, date)
                        }
                        placeholder="Date of Birth"
                        oneTap
                        shouldDisableDate={(date) => isAfter(date, new Date())}
                      />
                      <FormikErrorMessage name={DATE_OF_BIRTH} />
                    </Col>
                    <Col xs={12}>
                      <SelectDropdown
                        name={BRANCH}
                        data={Branch}
                        searchable={false}
                        placeholder="Select Branch"
                        value={formikProps.values[BRANCH]}
                        onChange={(value) =>
                          formikProps.setFieldValue(BRANCH, value)
                        }
                      />
                      <FormikErrorMessage name={BRANCH} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={GITHUB}
                        placeholder="GitHub URL"
                      />
                      <FormikErrorMessage name={GITHUB} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={LINKEDIN}
                        placeholder="LinkedIn URL"
                      />
                      <FormikErrorMessage name={LINKEDIN} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={ADDRESS}
                        placeholder="Address"
                      />
                      <FormikErrorMessage name={ADDRESS} />
                    </Col>
                  </Row>
                </Section>
                <Section title="Additional Details">
                  <FieldArray name={ACADEMIC_DETAILS}>
                    {(arrayHelpers) => {
                      const selectedlevel = formikProps.values[
                        ACADEMIC_DETAILS
                      ].map((academicDetails) => academicDetails.level)
                      return (
                        <>
                          {formikProps.values[ACADEMIC_DETAILS].map(
                            (type, index) => {
                              // eslint-disable-next-line @typescript-eslint/no-shadow
                              const filteredLevelOptions = level.filter(
                                (option) =>
                                  !selectedlevel.includes(
                                    option.value as
                                      | 'SSC'
                                      | 'HSC'
                                      | 'DIPLOMA'
                                      | 'BE'
                                  ) || option.value === type.level
                              )
                              return (
                                <Row>
                                  <Col xs={8} md={4}>
                                    <SelectPicker
                                      searchable={false}
                                      data={filteredLevelOptions}
                                      value={type.level}
                                      onChange={(value) =>
                                        formikProps.setFieldValue(
                                          `${ACADEMIC_DETAILS}.${index}.level`,
                                          value
                                        )
                                      }
                                      disabled={index === 0}
                                      placeholder="Level"
                                      block
                                    />
                                  </Col>
                                  <Col xs={16} md={7}>
                                    <Input
                                      name={`${ACADEMIC_DETAILS}.${index}.institutionName`}
                                      value={type.institutionName}
                                      onChange={(value) =>
                                        formikProps.setFieldValue(
                                          `${ACADEMIC_DETAILS}.${index}.institutionName`,
                                          value
                                        )
                                      }
                                      placeholder="Institute Name"
                                    />
                                  </Col>
                                  <Col xs={8} md={4}>
                                    <Input
                                      name={`${ACADEMIC_DETAILS}.${index}.marks`}
                                      type="number"
                                      value={type.marks ?? ''}
                                      onChange={(value) =>
                                        formikProps.setFieldValue(
                                          `${ACADEMIC_DETAILS}.${index}.marks`,
                                          value
                                        )
                                      }
                                      placeholder="Percentage"
                                    />
                                  </Col>
                                  <Col xs={10} md={5}>
                                    <Input
                                      type="number"
                                      name={`${ACADEMIC_DETAILS}.${index}.passingYear`}
                                      value={type.passingYear ?? ''}
                                      onChange={(value) =>
                                        formikProps.setFieldValue(
                                          `${ACADEMIC_DETAILS}.${index}.passingYear`,
                                          value
                                        )
                                      }
                                      placeholder="Passing Year"
                                    />
                                  </Col>
                                  {!(
                                    formikProps.values[ACADEMIC_DETAILS]
                                      .length === 1 || index === 0
                                  ) && (
                                    <Col xs={3} md={2}>
                                      <Button
                                        className="circular-btn"
                                        appearance="subtle"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <MdRemoveCircle color="red" />
                                      </Button>
                                    </Col>
                                  )}

                                  {index ===
                                    formikProps.values[ACADEMIC_DETAILS]
                                      .length -
                                      1 &&
                                    formikProps.values[ACADEMIC_DETAILS][index]
                                      .level &&
                                    formikProps.values[ACADEMIC_DETAILS][index]
                                      .institutionName &&
                                    formikProps.values[ACADEMIC_DETAILS][index]
                                      .marks &&
                                    formikProps.values[ACADEMIC_DETAILS][index]
                                      .passingYear && (
                                      <Col xs={3} md={2}>
                                        <Button
                                          className="circular-btn"
                                          appearance="primary"
                                          onClick={() =>
                                            arrayHelpers.push({
                                              level: '',
                                              institutionName: '',
                                              marks: '',
                                              passingYear: ''
                                            })
                                          }
                                        >
                                          <PlusIcon color="green" />
                                        </Button>
                                      </Col>
                                    )}
                                </Row>
                              )
                            }
                          )}
                        </>
                      )
                    }}
                  </FieldArray>
                  {formikProps.errors[ACADEMIC_DETAILS] &&
                    formikProps.touched[ACADEMIC_DETAILS] && (
                      <Row>
                        <Col xs={24} md={20}>
                          <FormikErrorMessage name={ACADEMIC_DETAILS} />
                        </Col>
                      </Row>
                    )}
                  <Row>
                    <Col xs={24} md={11}>
                      <TextInput
                        formik={formikProps}
                        name={SKILLS}
                        placeholder="Skills"
                        as="textarea"
                        rows={5}
                      />
                      <FormikErrorMessage name={SKILLS} />
                    </Col>
                  </Row>
                </Section>
                <Section title="Profile Photo">
                  <Row>
                    <Col md={8} xs={24}>
                      <Uploader
                        draggable
                        accept=".jpeg,.jpg,.png,.gif,.svg"
                        listType="picture"
                        action="http://localhost:3000/post"
                        fileInfo={fileInfo}
                        onChange={(fileList) => {
                          if (fileList.length > 0) {
                            const file = fileList[fileList.length - 1]
                            if (file.blobFile && file.blobFile.size > maxSize) {
                              notifyError('File size must be less than 2 MB')
                              fileList.pop()
                              formikProps.setFieldValue(PROFILE_PHOTO, null)
                            } else {
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
                {renderFormButtons(formikProps)}
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default CreateEditStudentProfile
