import * as Yup from 'yup'

export enum RECRUITER_FORM_FIELDS {
  NAME = 'name',
  WEBSITE = 'website',
  EMAIL = 'email',
  PHONE = 'phone',
  ADDRESS = 'address',
  PASSWORD = 'password',
  PROFILE_PHOTO = 'profilePhoto'
}

export interface IRecruiterForm {
  [RECRUITER_FORM_FIELDS.NAME]: string;
  [RECRUITER_FORM_FIELDS.WEBSITE]: string;
  [RECRUITER_FORM_FIELDS.EMAIL]: string;
  [RECRUITER_FORM_FIELDS.PHONE]: string;
  [RECRUITER_FORM_FIELDS.ADDRESS]: string;
  [RECRUITER_FORM_FIELDS.PASSWORD]: string;
  [RECRUITER_FORM_FIELDS.PROFILE_PHOTO]: string | File | null;
}

export const defaultRecruiterFormValues: IRecruiterForm = {
  [RECRUITER_FORM_FIELDS.NAME]: '',
  [RECRUITER_FORM_FIELDS.WEBSITE]: '',
  [RECRUITER_FORM_FIELDS.EMAIL]: '',
  [RECRUITER_FORM_FIELDS.PHONE]: '',
  [RECRUITER_FORM_FIELDS.ADDRESS]: '',
  [RECRUITER_FORM_FIELDS.PASSWORD]: '',
  [RECRUITER_FORM_FIELDS.PROFILE_PHOTO]: null
}

export const recruiterValidationSchema = () => {
  return Yup.object().shape({
    [RECRUITER_FORM_FIELDS.NAME]: Yup.string().required('Name is required'),
    [RECRUITER_FORM_FIELDS.WEBSITE]: Yup.string()
      .url('Invalid website URL')
      .required('Website is required'),
    [RECRUITER_FORM_FIELDS.EMAIL]: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    [RECRUITER_FORM_FIELDS.PHONE]: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be no more than 15 digits'),
    [RECRUITER_FORM_FIELDS.ADDRESS]: Yup.string().required(
      'Address is required'
    ),
    [RECRUITER_FORM_FIELDS.PASSWORD]: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
  })
}

export interface Recruiter {
  name: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  profilePhoto?: File | null;
}

export type RecruiterSaveRequest = {
  recruiterDTO: Recruiter,
  file: File | null
}
