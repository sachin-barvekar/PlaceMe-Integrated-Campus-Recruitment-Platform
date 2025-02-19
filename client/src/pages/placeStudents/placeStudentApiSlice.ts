import { IListApiRequest, IListApiResponse } from 'api/types'
import PlacementApi from 'api/placementApi'
import { Placement } from './types'
import { getPaginationQueryParams } from './utils'

const placementApiSlice = PlacementApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlacementList: build.query<
      IListApiResponse<Placement>,
      IListApiRequest<Placement>
    >({
      query: (request) => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/placements',
          method: 'GET',
          params
        }
      },
      providesTags: ['placement-list']
    })
  })
})

export const { useFetchPlacementListQuery } = placementApiSlice

export default placementApiSlice
