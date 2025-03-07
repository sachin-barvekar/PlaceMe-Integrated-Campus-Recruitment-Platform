import * as Yup from 'yup'
import {
  AdminProfileResponse,
  RecruiterProfileResponse,
  StudentProfileResponse
} from './types'

export enum Tabs {
  PERSONAL = 'personal',
  ACADEMIC = 'academic',
  MY_RESUME = 'resume'
}

export const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' }
]

export const positionOptions = [
  { label: 'TPO', value: 'TPO' },
  { label: 'Assistant TPO', value: 'Assistant TPO' },
  { label: 'FACULTY', value: 'FACULTY' }
]

export const level = [
  { label: 'SSC', value: 'SSC' },
  { label: 'HSC', value: 'HSC' },
  { label: 'DIPLOMA', value: 'DIPLOMA' },
  { label: 'BE', value: 'BE' }
]

export const Branch = [
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'ENTC', value: 'ENTC' },
  { label: 'Mechanical', value: 'Mechanical' },
  { label: 'Civil', value: 'Civil' }
]

export enum STUDENT_FORM_FIELDS {
  GENDER = 'gender',
  MOBILE = 'mobile',
  DATE_OF_BIRTH = 'dateOfBirth',
  BRANCH = 'branch',
  ADDRESS = 'address',
  PROFILE_PHOTO = 'profilePhoto',
  ACADEMIC_DETAILS = 'academicDetails',
  SKILLS = 'skills',
  LINKEDIN = 'linkedIn',
  GITHUB = 'github'
}

export enum ACADEMIC_DETAILS {
  LEVEL = 'level',
  INSTITUTION_NAME = 'institutionName',
  MARKS = 'marks',
  PASSING_YEAR = 'passingYear'
}

export interface IStudentForm {
  [STUDENT_FORM_FIELDS.GENDER]: 'Male' | 'Female' | 'Other' | null;
  [STUDENT_FORM_FIELDS.MOBILE]: string;
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Date | undefined | string;
  [STUDENT_FORM_FIELDS.BRANCH]: string;
  [STUDENT_FORM_FIELDS.ADDRESS]: string;
  [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: string | undefined;
  [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: {
    level: 'SSC' | 'HSC' | 'BE' | 'DIPLOMA',
    institutionName: string,
    marks: number | null,
    passingYear: number | null
  }[];
  [STUDENT_FORM_FIELDS.SKILLS]: string;
  [STUDENT_FORM_FIELDS.LINKEDIN]: string;
  [STUDENT_FORM_FIELDS.GITHUB]: string;
}

export const defaultStudentFormValues: IStudentForm = {
  [STUDENT_FORM_FIELDS.GENDER]: null,
  [STUDENT_FORM_FIELDS.MOBILE]: '',
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: undefined,
  [STUDENT_FORM_FIELDS.BRANCH]: '',
  [STUDENT_FORM_FIELDS.ADDRESS]: '',
  [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: undefined,
  [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: [
    { level: 'SSC', institutionName: '', marks: null, passingYear: null }
  ],
  [STUDENT_FORM_FIELDS.SKILLS]: '',
  [STUDENT_FORM_FIELDS.LINKEDIN]: '',
  [STUDENT_FORM_FIELDS.GITHUB]: ''
}
export const getInitialProfileFormValueFromResponse = (
  profile: StudentProfileResponse
): IStudentForm => ({
  [STUDENT_FORM_FIELDS.GENDER]: profile?.student?.gender ?? null,
  [STUDENT_FORM_FIELDS.MOBILE]: profile?.student?.mobile ?? '',
  [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]:
    profile?.student?.dateOfBirth ?? undefined,
  [STUDENT_FORM_FIELDS.BRANCH]: profile?.student?.branch ?? '',
  [STUDENT_FORM_FIELDS.ADDRESS]: profile?.student?.address ?? '',
  [STUDENT_FORM_FIELDS.PROFILE_PHOTO]:
    profile?.student?.profilePhoto ?? undefined,
  [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]:
    profile?.student?.academicDetails?.map((detail: any) => ({
      level: detail.level ?? '',
      institutionName: detail.institutionName ?? '',
      marks: detail.marks ?? null,
      passingYear: detail.passingYear ?? null
    })) ?? [
      { level: 'SSC', institutionName: '', marks: null, passingYear: null }
    ],
  [STUDENT_FORM_FIELDS.SKILLS]: profile?.student?.skills ?? '',
  [STUDENT_FORM_FIELDS.LINKEDIN]: profile?.student?.linkedIn ?? '',
  [STUDENT_FORM_FIELDS.GITHUB]: profile?.student?.github ?? ''
})

export const studentValidationSchema = () => {
  return Yup.object().shape({
    [STUDENT_FORM_FIELDS.GENDER]: Yup.string()
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
      .required('Gender is required'),

    [STUDENT_FORM_FIELDS.MOBILE]: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{12}$/, 'Mobile number must be exactly 12 digits'),

    [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Yup.date()
      .nullable()
      .required('Date of Birth is required'),

    [STUDENT_FORM_FIELDS.BRANCH]: Yup.string().required('Branch is required'),
    [STUDENT_FORM_FIELDS.ADDRESS]: Yup.string()
      .required('Address is required')
      .max(255, 'Address cannot exceed 255 characters'),

    [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: Yup.mixed().required(
      'Profile Picture is required'
    ),

    [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: Yup.array()
      .of(
        Yup.object().shape({
          level: Yup.string()
            .oneOf(['SSC', 'HSC', 'BE', 'DIPLOMA'], 'Invalid education level')
            .required('Education level is required'),

          institutionName: Yup.string()
            .required('Institution name is required')
            .min(2, 'Institution name must be at least 2 characters')
            .max(100, 'Institution name cannot exceed 100 characters'),

          marks: Yup.number()
            .min(35, 'Marks must be at least 35')
            .max(100, 'Marks cannot exceed 100')
            .typeError('Marks must be a number')
            .required('Marks are required'),

          passingYear: Yup.number()
            .min(1950, 'Invalid year')
            .max(new Date().getFullYear(), 'Year cannot be in the future')
            .typeError('Passing year must be a number')
            .required('Passing year is required')
        })
      )
      .min(
        3,
        'At least three academic details are required. Please click to add button to further add other academic details.'
      ),

    [STUDENT_FORM_FIELDS.SKILLS]: Yup.string()
      .required('Skills are required')
      .max(500, 'Skills cannot exceed 500 characters'),

    [STUDENT_FORM_FIELDS.LINKEDIN]: Yup.string()
      .nullable()
      .test(
        'is-valid-linkedin-url',
        'Invalid LinkedIn profile URL. Ensure it starts with https://',
        (value) => !value || value.startsWith('https://')
      )
      .test(
        'has-www',
        'URL should contain "www."',
        (value) => !value || /^(https?:\/\/)?(www\.)/.test(value)
      )
      .test(
        'has-profile',
        'URL should contain a profile name after "linkedin.com/in/"',
        (value) => !value || /\/in\/[a-zA-Z0-9_-]+/.test(value)
      )
      .matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/,
        'Invalid LinkedIn profile URL'
      ),

    [STUDENT_FORM_FIELDS.GITHUB]: Yup.string()
      .nullable()
      .test(
        'is-valid-github-url',
        'Invalid GitHub profile URL. Ensure it starts with https://',
        (value) => !value || value.startsWith('https://')
      )
      .test(
        'has-profile',
        'URL should contain a profile name after "github.com/"',
        (value) => !value || /\/[a-zA-Z0-9-_]+/.test(value)
      )
      .matches(
        /^(https?:\/\/)?github\.com\/[a-zA-Z0-9-_]+$/,
        'Invalid GitHub profile URL'
      )
  })
}

export enum ADMIN_PROFILE_FIELDS {
  GENDER = 'gender',
  MOBILE = 'mobile',
  POSITION = 'position',
  LINKEDIN = 'linkedIn',
  COLLEGE_NAME = 'collegeName',
  COLLEGE_ADDRESS = 'collegeAddress',
  PROFILE_PHOTO = 'profilePhoto'
}

export type IAdminProfile = {
  [ADMIN_PROFILE_FIELDS.GENDER]: 'Male' | 'Female' | 'Other' | null,
  [ADMIN_PROFILE_FIELDS.MOBILE]: string,
  [ADMIN_PROFILE_FIELDS.POSITION]: 'TPO' | 'Assistant TPO' | 'FACULTY' | null,
  [STUDENT_FORM_FIELDS.LINKEDIN]: string,
  [ADMIN_PROFILE_FIELDS.COLLEGE_NAME]: string,
  [ADMIN_PROFILE_FIELDS.COLLEGE_ADDRESS]: string,
  [ADMIN_PROFILE_FIELDS.PROFILE_PHOTO]: string
}

export const defaultAdminProfileValues: IAdminProfile = {
  [ADMIN_PROFILE_FIELDS.POSITION]: null,
  [ADMIN_PROFILE_FIELDS.PROFILE_PHOTO]: '',
  [ADMIN_PROFILE_FIELDS.MOBILE]: '',
  [ADMIN_PROFILE_FIELDS.COLLEGE_NAME]: '',
  [ADMIN_PROFILE_FIELDS.COLLEGE_ADDRESS]: '',
  [ADMIN_PROFILE_FIELDS.GENDER]: null,
  [STUDENT_FORM_FIELDS.LINKEDIN]: ''
}

export const getInitialAdminProfileFromResponse = (
  profile: AdminProfileResponse
): IAdminProfile => ({
  [ADMIN_PROFILE_FIELDS.POSITION]: profile?.admin?.position ?? null,
  [ADMIN_PROFILE_FIELDS.PROFILE_PHOTO]: profile?.admin?.profilePhoto ?? '',
  [ADMIN_PROFILE_FIELDS.MOBILE]: profile?.admin?.mobile ?? '',
  [ADMIN_PROFILE_FIELDS.COLLEGE_NAME]: profile?.admin?.collegeName ?? '',
  [ADMIN_PROFILE_FIELDS.COLLEGE_ADDRESS]: profile?.admin?.collegeAddress ?? '',
  [ADMIN_PROFILE_FIELDS.GENDER]: profile?.admin?.gender ?? null,
  [STUDENT_FORM_FIELDS.LINKEDIN]: profile?.admin?.linkedIn ?? ''
})

export const adminProfileValidationSchema = () => {
  return Yup.object().shape({
    [ADMIN_PROFILE_FIELDS.GENDER]: Yup.string()
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
      .required('Gender is required'),
    [ADMIN_PROFILE_FIELDS.POSITION]: Yup.string().required(
      'Position is required'
    ),
    [ADMIN_PROFILE_FIELDS.MOBILE]: Yup.string()
      .required('Mobile number is required')
      .matches(/^\d{12}$/, 'Mobile number must be 12 digits'),

    [ADMIN_PROFILE_FIELDS.COLLEGE_NAME]: Yup.string()
      .required('College name is required')
      .max(50, 'College name cannot exceed 50 characters'),

    [ADMIN_PROFILE_FIELDS.COLLEGE_ADDRESS]: Yup.string()
      .required('College address is required')
      .max(100, 'College address cannot exceed 100 characters'),
    [ADMIN_PROFILE_FIELDS.LINKEDIN]: Yup.string()
      .nullable()
      .test(
        'is-valid-linkedin-url',
        'Invalid LinkedIn profile URL. Ensure it starts with https://',
        (value) => !value || value.startsWith('https://')
      )
      .test(
        'has-www',
        'URL should contain "www."',
        (value) => !value || /^(https?:\/\/)?(www\.)/.test(value)
      )
      .test(
        'has-profile',
        'URL should contain a profile name after "linkedin.com/in/"',
        (value) => !value || /\/in\/[a-zA-Z0-9_-]+/.test(value)
      )
      .matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/,
        'Invalid LinkedIn profile URL'
      ),
    [ADMIN_PROFILE_FIELDS.PROFILE_PHOTO]: Yup.mixed().required(
      'Profile Picture is required'
    )
  })
}

export enum RECRUITER_PROFILE_FIELDS {
  COMPANY_NAME = 'companyName',
  ABOUT_US = 'aboutUs',
  COMPANY_WEBSITE = 'companyWebsite',
  LINKEDIN = 'linkedIn',
  PROFILE_PHOTO = 'profilePhoto',
  ADDRESS = 'address'
}

export type IRecruiterProfile = {
  [RECRUITER_PROFILE_FIELDS.COMPANY_NAME]: string,
  [RECRUITER_PROFILE_FIELDS.ABOUT_US]: string,
  [RECRUITER_PROFILE_FIELDS.COMPANY_WEBSITE]: string,
  [RECRUITER_PROFILE_FIELDS.LINKEDIN]: string,
  [RECRUITER_PROFILE_FIELDS.PROFILE_PHOTO]: string,
  [RECRUITER_PROFILE_FIELDS.ADDRESS]: string
}

export const defaultRecruiterProfileValues: IRecruiterProfile = {
  [RECRUITER_PROFILE_FIELDS.COMPANY_NAME]: '',
  [RECRUITER_PROFILE_FIELDS.ABOUT_US]: '',
  [RECRUITER_PROFILE_FIELDS.COMPANY_WEBSITE]: '',
  [RECRUITER_PROFILE_FIELDS.LINKEDIN]: '',
  [RECRUITER_PROFILE_FIELDS.PROFILE_PHOTO]: '',
  [RECRUITER_PROFILE_FIELDS.ADDRESS]: ''
}

export const getInitialRecruiterProfileFromResponse = (
  profile: RecruiterProfileResponse
): IRecruiterProfile => ({
  [RECRUITER_PROFILE_FIELDS.COMPANY_NAME]:
    profile?.recruiter?.companyName ?? '',
  [RECRUITER_PROFILE_FIELDS.ABOUT_US]: profile?.recruiter?.aboutUs ?? '',
  [RECRUITER_PROFILE_FIELDS.COMPANY_WEBSITE]:
    profile?.recruiter?.companyWebsite ?? '',
  [RECRUITER_PROFILE_FIELDS.LINKEDIN]: profile?.recruiter?.linkedIn ?? '',
  [RECRUITER_PROFILE_FIELDS.PROFILE_PHOTO]:
    profile?.recruiter?.profilePhoto ?? '',
  [RECRUITER_PROFILE_FIELDS.ADDRESS]: profile?.recruiter?.address ?? ''
})

export const recruiterProfileValidationSchema = () => {
  return Yup.object().shape({
    [RECRUITER_PROFILE_FIELDS.COMPANY_NAME]: Yup.string()
      .required('Company name is required')
      .max(100, 'Company name cannot exceed 100 characters'),

    [RECRUITER_PROFILE_FIELDS.ABOUT_US]: Yup.string()
      .max(1000, 'About Us section cannot exceed 1000 characters')
      .min(2, 'About Us  at least 2 characters'),

    [RECRUITER_PROFILE_FIELDS.COMPANY_WEBSITE]: Yup.string()
      .nullable()
      .matches(
        /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d@:%_+.~#?&//=]*)?$/,
        'Invalid company website URL'
      ),

    [RECRUITER_PROFILE_FIELDS.LINKEDIN]: Yup.string()
      .nullable()
      .matches(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/,
        'Invalid LinkedIn profile URL'
      ),
    [RECRUITER_PROFILE_FIELDS.PROFILE_PHOTO]: Yup.mixed().nullable(),
    [RECRUITER_PROFILE_FIELDS.ADDRESS]: Yup.string()
      .required('Address is required')
      .min(2, 'Address at least 2 characters')
      .max(255, 'Address cannot exceed 255 characters')
  })
}
