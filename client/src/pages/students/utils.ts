import { IListApiRequest } from '../../api/types'
import { Students, StudentsListParams } from './types'

export const getPaginationQueryParams = (
  request: IListApiRequest<Students>,
): StudentsListParams => {
  const { filters, page } = request
  const params: StudentsListParams = {
    size: page?.size,
    page: page?.number ? page.number - 1 : 0,
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
