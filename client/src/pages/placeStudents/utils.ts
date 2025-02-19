import { IListApiRequest } from 'api/types'
import { Placement, PlacementListParams } from './types'

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
