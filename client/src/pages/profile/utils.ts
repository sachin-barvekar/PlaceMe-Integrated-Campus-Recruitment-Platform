import * as Yup from 'yup'

export enum STUDENT_FORM_FIELDS {
    GENDER = 'gender',
    MOBILE = 'mobile',
    DATE_OF_BIRTH = 'dateOfBirth',
    BRANCH = 'branch',
    ADDRESS = 'address',
    PROFILE_PHOTO = 'profilePhoto',
    ACADEMIC_DETAILS = 'academicDetails',
    SKILLS = 'skills'
}

export enum ACADEMIC_DETAILS {
    // eslint-disable-next-line
    level = 'level',
    // eslint-disable-next-line
    institutionName = 'institutionName',
    // eslint-disable-next-line
    marks = 'marks',
    // eslint-disable-next-line
    passingYear = 'passingYear'
}


export interface IStudentForm {
    [STUDENT_FORM_FIELDS.GENDER]: string;
    [STUDENT_FORM_FIELDS.MOBILE]: string;
    [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Date | null;
    [STUDENT_FORM_FIELDS.BRANCH]: string;
    [STUDENT_FORM_FIELDS.ADDRESS]: string;
    [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: string | File | null;
    [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: {
        level: string;
        institutionName: string;
        marks: string;
        passingYear: string;
    }[];
    [STUDENT_FORM_FIELDS.SKILLS]: string
}

export const defaultStudentFormValues: IStudentForm = {
    [STUDENT_FORM_FIELDS.GENDER]: '',
    [STUDENT_FORM_FIELDS.MOBILE]: '',
    [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: null,
    [STUDENT_FORM_FIELDS.BRANCH]: '',
    [STUDENT_FORM_FIELDS.ADDRESS]: '',
    [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: null,
    [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: [
        { level: '', institutionName: '', marks: '', passingYear: '' }
    ],
    [STUDENT_FORM_FIELDS.SKILLS]: '',
}

export const studentValidationSchema = () => {
    return Yup.object().shape({
        [STUDENT_FORM_FIELDS.GENDER]: Yup.string().required('Gender is required'),
        [STUDENT_FORM_FIELDS.MOBILE]: Yup.string()
            .required('Mobile number is required')
            .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
            .min(10, 'Mobile number must be at least 10 digits')
            .max(15, 'Mobile number must be no more than 15 digits'),
        [STUDENT_FORM_FIELDS.DATE_OF_BIRTH]: Yup.date()
            .nullable()
            .required('Date of Birth is required'),
        [STUDENT_FORM_FIELDS.BRANCH]: Yup.string().required('Branch is required'),
        [STUDENT_FORM_FIELDS.ADDRESS]: Yup.string().required('Address is required'),
        [STUDENT_FORM_FIELDS.PROFILE_PHOTO]: Yup.mixed().required('Profile Photo is required'),
        [STUDENT_FORM_FIELDS.ACADEMIC_DETAILS]: Yup.array()
        .of(
          Yup.object().shape({
            level: Yup.string().required('Education level is required'),
            institutionName: Yup.string().required('Institution name is required'),
            marks: Yup.number()
              .min(0, 'Marks cannot be negative')
              .max(100, 'Marks cannot exceed 100')
              .typeError('Marks must be a number')
              .required('Marks are required'),
            passingYear: Yup.number()
              .min(1900, 'Enter a valid year')
              .max(new Date().getFullYear(), 'Year cannot be in the future')
              .typeError('Passing year must be a number')
              .required('Passing year is required')
          })
        )
        .min(1, 'At least three academic details are required'),
        [STUDENT_FORM_FIELDS.SKILLS]: Yup.string().required('Skills are required')
    })
}
