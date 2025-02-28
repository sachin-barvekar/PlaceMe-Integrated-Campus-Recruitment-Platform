import { IListApiRequest, IListApiResponse } from 'api/types'
import jobApi from 'api/jobApi'
import { Job } from './types'
import { getPaginationQueryParams } from './utils'

const jobApiSlice = jobApi.injectEndpoints({
  endpoints: (build) => ({
    fetchJobOpening: build.query<IListApiResponse<Job>, IListApiRequest<Job>>({
      query: (request) => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/job-openings',
          method: 'GET',
          params
        }
      },
      providesTags: ['job-list']
    }),
    fetchJobById: build.query<IListApiResponse<Job>, IListApiRequest<Job>>({
      query: (request) => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/jobs',
          method: 'GET',
          params
        }
      },
      providesTags: ['job-list']
    }),
    createJob: build.mutation<void, Job>({
      // eslint-disable-next-line
      query: (Job) => {
        return {
          url: `/jobs/create`,
          method: 'POST',
          data: Job
        }
      },
      invalidatesTags: ['job-list']
    }),
    // eslint-disable-next-line
    updateJob: build.mutation<void, Job>({
      // eslint-disable-next-line
      query: (Job) => {
        return {
          // eslint-disable-next-line
          url: `/jobs/edit/${Job?._id}`,
          method: 'PUT',
          data: Job
        }
      },
      invalidatesTags: ['job-list']
    }),
    deleteJob: build.mutation<void, { jobId: string }>({
      query: ({ jobId }) => {
        return {
          url: `/jobs/delete/${jobId}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['job-list']
    })
  })
})

export const {
  useFetchJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useFetchJobOpeningQuery
} = jobApiSlice

export default jobApiSlice
