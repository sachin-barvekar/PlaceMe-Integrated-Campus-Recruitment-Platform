import * as Yup from 'yup'
import { IListApiRequest } from 'api/types'
import { Job } from './types'

export enum ACTIVE_TAB {
  ALL = 'all',
  Active = 'true',
  InActive = 'false'
}

export enum JOB_TYPE_OPTION {
  FULL_TIME = 'Full-Time',
  PART_TIME = 'Part-Time',
  INTERNSHIP = 'Internship'
}
export enum JOB_FORM_FIELDS {
  RECRUITER_ID = 'recruiterId',
  ROLE = 'role',
  JOB_DESCRIPTION = 'jobDescription',
  LOCATION = 'location',
  JOB_TYPE = 'jobType',
  PACKAGE = 'package',
  SKILLS_REQUIRED = 'skillsRequired',
  ELIGIBILITY_CRITERIA = 'eligibilityCriteria',
  LAST_DATE_TO_APPLY = 'lastDateToApply',
  DRIVE_DATE = 'driveDate'
}

export interface IJobForm {
  [JOB_FORM_FIELDS.RECRUITER_ID]: any;
  [JOB_FORM_FIELDS.ROLE]: string;
  [JOB_FORM_FIELDS.JOB_DESCRIPTION]: string;
  [JOB_FORM_FIELDS.LOCATION]: string;
  [JOB_FORM_FIELDS.JOB_TYPE]: JOB_TYPE_OPTION | undefined;
  [JOB_FORM_FIELDS.PACKAGE]: string;
  [JOB_FORM_FIELDS.SKILLS_REQUIRED]: string;
  [JOB_FORM_FIELDS.ELIGIBILITY_CRITERIA]: string;
  [JOB_FORM_FIELDS.LAST_DATE_TO_APPLY]: Date | undefined | string;
  [JOB_FORM_FIELDS.DRIVE_DATE]: Date | undefined | string;
}

export const defaultJobFormValues: IJobForm = {
  [JOB_FORM_FIELDS.RECRUITER_ID]: undefined,
  [JOB_FORM_FIELDS.ROLE]: '',
  [JOB_FORM_FIELDS.JOB_DESCRIPTION]: '',
  [JOB_FORM_FIELDS.LOCATION]: '',
  [JOB_FORM_FIELDS.JOB_TYPE]: undefined,
  [JOB_FORM_FIELDS.PACKAGE]: '',
  [JOB_FORM_FIELDS.SKILLS_REQUIRED]: '',
  [JOB_FORM_FIELDS.ELIGIBILITY_CRITERIA]: '',
  [JOB_FORM_FIELDS.LAST_DATE_TO_APPLY]: undefined,
  [JOB_FORM_FIELDS.DRIVE_DATE]: undefined
}

export const getInitialJobFormValueFromResponse = (job: Job): IJobForm => ({
  [JOB_FORM_FIELDS.RECRUITER_ID]: job?.recruiterId ?? undefined,
  [JOB_FORM_FIELDS.ROLE]: job?.role ?? '',
  [JOB_FORM_FIELDS.JOB_DESCRIPTION]: job?.jobDescription ?? '',
  [JOB_FORM_FIELDS.LOCATION]: job?.location ?? '',
  [JOB_FORM_FIELDS.JOB_TYPE]: job?.jobType ?? undefined,
  [JOB_FORM_FIELDS.PACKAGE]: job?.package ?? '',
  [JOB_FORM_FIELDS.SKILLS_REQUIRED]: job?.skillsRequired ?? '',
  [JOB_FORM_FIELDS.ELIGIBILITY_CRITERIA]: job?.eligibilityCriteria ?? '',
  [JOB_FORM_FIELDS.LAST_DATE_TO_APPLY]: job?.lastDateToApply ?? undefined,
  [JOB_FORM_FIELDS.DRIVE_DATE]: job?.driveDate ?? undefined
})

export const jobValidationSchema = () => {
  return Yup.object().shape({
    [JOB_FORM_FIELDS.ROLE]: Yup.string()
      .required('Job role is required')
      .min(2, 'Job role must be at least 2 characters')
      .max(50, 'Job role cannot exceed 50 characters'),

    [JOB_FORM_FIELDS.JOB_DESCRIPTION]: Yup.string()
      .required('Job description is required')
      .min(10, 'Job description must be at least 10 characters')
      .max(500, 'Job description cannot exceed 500 characters'),

    [JOB_FORM_FIELDS.LOCATION]: Yup.string()
      .required('Location is required')
      .min(2, 'Location must be at least 2 characters')
      .max(100, 'Location cannot exceed 100 characters'),

    [JOB_FORM_FIELDS.JOB_TYPE]: Yup.string()
      .oneOf(['Full-Time', 'Part-Time', 'Internship'])
      .required('Job type is required'),

    [JOB_FORM_FIELDS.PACKAGE]: Yup.string()
      .optional()
      .max(50, 'Package cannot exceed 50 characters'),

    [JOB_FORM_FIELDS.SKILLS_REQUIRED]: Yup.string()
      .required('Skills required field is required')
      .min(2, 'Skills required must be at least 2 characters')
      .max(200, 'Skills required cannot exceed 200 characters'),

    [JOB_FORM_FIELDS.ELIGIBILITY_CRITERIA]: Yup.string()
      .optional()
      .max(200, 'Eligibility criteria cannot exceed 200 characters'),

    [JOB_FORM_FIELDS.LAST_DATE_TO_APPLY]: Yup.date()
      .required('Last date to apply is required')
      .max(
        Yup.ref(JOB_FORM_FIELDS.DRIVE_DATE),
        'Last date to apply must be on or before Drive Date'
      ),

    [JOB_FORM_FIELDS.DRIVE_DATE]: Yup.date().required('Drive Date is required')
  })
}

export const getPaginationQueryParams = (request: IListApiRequest<Job>) => {
  const { filters, page } = request
  const params: any = {
    size: page?.size,
    page: page?.number ? page.number - 1 : 0
  }

  if (filters && filters.length > 0) {
    filters.forEach(({ fieldName, fieldValue }) => {
      if (!fieldValue || fieldValue === 'all') {
        delete params[fieldName]
      } else {
        params[fieldName] = fieldValue
      }
    })
  }
  return params
}
