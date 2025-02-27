import { IListApiRequest } from 'api/types'
import { Recruiter, RecruitersListParams } from './types'

export const getPaginationQueryParams = (
  request: IListApiRequest<Recruiter>
): RecruitersListParams => {
  const { filters, page } = request
  const params: RecruitersListParams = {
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
