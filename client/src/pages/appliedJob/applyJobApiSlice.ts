import applyJobApi from 'api/applyJobApi'
import { IListApiRequest, IListApiResponse } from 'api/types'
import { Job } from 'pages/jobs/types'
import { getPaginationQueryParams } from 'pages/jobs/utils'

const applyJobApiSlice = applyJobApi.injectEndpoints({
  endpoints: (build) => ({
    applyJob: build.mutation<void, { jobId: string }>({
      query: ({ jobId }) => {
        return {
          url: `/jobs/apply/${jobId}`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['apply-job']
    }),
    getAppliedJobs: build.query<IListApiResponse<Job>, IListApiRequest<Job>>({
      query: (request) => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/jobs/applied',
          method: 'GET',
          params
        }
      },
      providesTags: ['apply-job']
    }),
    withdrawJobApplication: build.mutation<void, { jobId: string }>({
      query: ({ jobId }) => {
        return {
          url: `/jobs/withdraw/${jobId}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: ['apply-job']
    })
  })
})

export const {
  useApplyJobMutation,
  useGetAppliedJobsQuery,
  useWithdrawJobApplicationMutation
} = applyJobApiSlice
