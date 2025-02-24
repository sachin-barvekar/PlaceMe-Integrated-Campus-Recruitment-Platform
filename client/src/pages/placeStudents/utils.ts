import * as Yup from 'yup'
import { IListApiRequest } from 'api/types'
import { Placement, PlacementListParams } from './types'

export enum PLACEMENT_FORM_FIELDS {
  STUDENT_NAME = 'studentId',
  COMPANY_NAME = 'companyName',
  COMPANY_ID = 'companyID',
  JOB_ROLE = 'jobRole',
  PACKAGE = 'package',
  LOCATION = 'location',
  STATUS = 'status'
}

export interface IPlacementForm {
  [PLACEMENT_FORM_FIELDS.STUDENT_NAME]: string;
  [PLACEMENT_FORM_FIELDS.COMPANY_NAME]: string;
  [PLACEMENT_FORM_FIELDS.COMPANY_ID]: string | undefined;
  [PLACEMENT_FORM_FIELDS.JOB_ROLE]: string;
  [PLACEMENT_FORM_FIELDS.PACKAGE]: string;
  [PLACEMENT_FORM_FIELDS.LOCATION]: string;
  [PLACEMENT_FORM_FIELDS.STATUS]: 'Placed' | 'Pending' | 'Rejected';
}

export const defaultPlacementFormValues: IPlacementForm = {
  [PLACEMENT_FORM_FIELDS.STUDENT_NAME]: '',
  [PLACEMENT_FORM_FIELDS.COMPANY_NAME]: '',
  [PLACEMENT_FORM_FIELDS.COMPANY_ID]: '',
  [PLACEMENT_FORM_FIELDS.JOB_ROLE]: '',
  [PLACEMENT_FORM_FIELDS.PACKAGE]: '',
  [PLACEMENT_FORM_FIELDS.LOCATION]: '',
  [PLACEMENT_FORM_FIELDS.STATUS]: 'Placed'
}

export const getInitialPlacementFormValueFromResponse = (
  placement: Placement
): IPlacementForm => ({
  [PLACEMENT_FORM_FIELDS.STUDENT_NAME]: placement?.studentId ?? '',
  [PLACEMENT_FORM_FIELDS.COMPANY_NAME]: placement?.companyName ?? '',
  [PLACEMENT_FORM_FIELDS.COMPANY_ID]: placement?.companyId ?? 'other',
  [PLACEMENT_FORM_FIELDS.JOB_ROLE]: placement?.jobRole ?? '',
  [PLACEMENT_FORM_FIELDS.PACKAGE]: placement?.package ?? '',
  [PLACEMENT_FORM_FIELDS.LOCATION]: placement?.location ?? '',
  [PLACEMENT_FORM_FIELDS.STATUS]: placement?.status ?? 'Placed'
})

export const placementValidationSchema = () => {
  return Yup.object().shape({
    [PLACEMENT_FORM_FIELDS.STUDENT_NAME]: Yup.string().required(
      'Student name is required'
    ),

    [PLACEMENT_FORM_FIELDS.COMPANY_NAME]: Yup.string().when(
      PLACEMENT_FORM_FIELDS.COMPANY_ID,
      {
        is: 'other',
        then: (schema) =>
          schema
            .required('Company name is required')
            .min(2, 'Company name must be at least 2 characters')
            .max(50, 'Company name cannot exceed 50 characters'),
        otherwise: (schema) => schema.notRequired()
      }
    ),

    [PLACEMENT_FORM_FIELDS.COMPANY_ID]: Yup.string().required(
      'Company selection is required'
    ),

    [PLACEMENT_FORM_FIELDS.JOB_ROLE]: Yup.string()
      .required('Job role is required')
      .min(2, 'Job role must be at least 2 characters')
      .max(50, 'Job role cannot exceed 50 characters'),

    [PLACEMENT_FORM_FIELDS.PACKAGE]: Yup.string()
      .required('Package is required')
      .min(2, 'Package must be at least 2 characters')
      .max(50, 'Package cannot exceed 50 characters'),

    [PLACEMENT_FORM_FIELDS.LOCATION]: Yup.string()
      .required('Location is required')
      .min(2, 'Location must be at least 2 characters')
      .max(100, 'Location cannot exceed 100 characters')
  })
}

export const getPaginationQueryParams = (
  request: IListApiRequest<Placement>
): PlacementListParams => {
  const { filters, page } = request
  const params: PlacementListParams = {
    size: page?.size,
    page: page?.number ? page.number - 1 : 0
  }
  if (filters && filters.length > 0) {
    filters.forEach(({ fieldName, fieldValue }) => {
      if (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === '' ||
        fieldValue === 'all'
      ) {
        delete params[fieldName]
      } else {
        params[fieldName] = fieldValue
      }
    })
  }

  return params
}
