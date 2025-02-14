import * as Yup from 'yup'

export enum STUDENT_FORM_FIELDS {
  NAME = 'name',
  GENDER = 'gender',
  MOBILE = 'mobile',
  EMAIL = 'email',
  DATE_OF_BIRTH = 'dateOfBirth',
  BRANCH = 'branch',
  ADDRESS = 'address',
  PASSWORD = 'password',
  PROFILE_PHOTO = 'profilePhoto'
}

export interface IStudentForm {
  [STUDENT_FORM_FIELDS.NAME]: string;
  [STUDENT_FORM_FIELDS.GENDER]: string;
  [STUDENT_FORM_FIELDS.MOBILE]: string;
  [STUDENT_FORM_FIELDS.EMAIL]: string;
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Date | null;
  [STUDENT_FORM_FIELDS.BRANCH]: string;
  [STUDENT_FORM_FIELDS.ADDRESS]: string;
  [STUDENT_FORM_FIELDS.PASSWORD]: string;
  [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: string | File | null;
}

export const defaultStudentFormValues: IStudentForm = {
  [STUDENT_FORM_FIELDS.NAME]: '',
  [STUDENT_FORM_FIELDS.GENDER]: '',
  [STUDENT_FORM_FIELDS.MOBILE]: '',
  [STUDENT_FORM_FIELDS.EMAIL]: '',
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: null,
  [STUDENT_FORM_FIELDS.BRANCH]: '',
  [STUDENT_FORM_FIELDS.ADDRESS]: '',
  [STUDENT_FORM_FIELDS.PASSWORD]: '',
  [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: null
}

export const studentValidationSchema = () => {
  return Yup.object().shape({
    [STUDENT_FORM_FIELDS.NAME]: Yup.string().required('Name is required'),
    [STUDENT_FORM_FIELDS.GENDER]: Yup.string().required('Gender is required'),
    [STUDENT_FORM_FIELDS.MOBILE]: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
      .min(10, 'Mobile number must be at least 10 digits')
      .max(15, 'Mobile number must be no more than 15 digits'),
    [STUDENT_FORM_FIELDS.EMAIL]: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Yup.date()
      .nullable()
      .required('Date of Birth is required'),
    [STUDENT_FORM_FIELDS.BRANCH]: Yup.string().required('Branch is required'),
    [STUDENT_FORM_FIELDS.ADDRESS]: Yup.string().required('Address is required'),
    [STUDENT_FORM_FIELDS.PASSWORD]: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
  })
}

export interface Student {
  name: string;
  gender: string;
  mobile: string;
  email: string;
  dateOfBirth: Date | null;
  branch: string;
  address: string;
  password: string;
  profilePhoto?: File | null;
}

export type StudentSaveRequest = {
  studentDTO: Student,
  file: File | null
}

export const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }
]
