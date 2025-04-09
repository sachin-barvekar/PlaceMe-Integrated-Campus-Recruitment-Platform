import { IListApiRequest, IListApiResponse } from '../../api/types'
import PlacementApi from '../../api/placementApi'
import { Placement, PlacementSaveRequest } from './types'
import { getPaginationQueryParams } from './utils'

const placementApiSlice = PlacementApi.injectEndpoints({
  endpoints: build => ({
    fetchPlacementList: build.query<
      IListApiResponse<Placement>,
      IListApiRequest<Placement>
    >({
      query: request => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/placements',
          method: 'GET',
          params,
        }
      },
      providesTags: ['placement-list'],
    }),
    fetchPlacementListByRecruiter: build.query<
      IListApiResponse<Placement>,
      IListApiRequest<Placement>
    >({
      query: request => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/placement-by-recruiter',
          method: 'GET',
          params,
        }
      },
      providesTags: ['placement-list'],
    }),
    createPlacement: build.mutation<void, PlacementSaveRequest>({
      query: ({ placementDTO }) => {
        return {
          url: `/placements/create`,
          method: 'POST',
          data: placementDTO,
        }
      },
      invalidatesTags: ['placement-list'],
    }),
    addPlacementByRecruiter: build.mutation<void, PlacementSaveRequest>({
      query: ({ placementDTO }) => {
        return {
          url: `/placement-by-recruiter`,
          method: 'POST',
          data: placementDTO,
        }
      },
      invalidatesTags: ['placement-list'],
    }),
    updatePlacement: build.mutation<void, PlacementSaveRequest>({
      query: ({ placementDTO }) => {
        return {
          url: `/placements/edit/${placementDTO?._id}`,
          method: 'PUT',
          data: placementDTO,
        }
      },
      invalidatesTags: ['placement-list'],
    }),
    deletePlacement: build.mutation<void, { _id: string }>({
      query: ({ _id }) => {
        return {
          url: `/placements/delete/${_id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['placement-list'],
    }),
  }),
})

export const {
  useFetchPlacementListQuery,
  useCreatePlacementMutation,
  useUpdatePlacementMutation,
  useDeletePlacementMutation,
  useAddPlacementByRecruiterMutation,
  useFetchPlacementListByRecruiterQuery,
} = placementApiSlice

export default placementApiSlice
