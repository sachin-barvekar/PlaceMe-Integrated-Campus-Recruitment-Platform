import { IListApiRequest, IListApiResponse } from '../../api/types'
import jobApi from '../../api/jobApi'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchJobDetailsById: build.query<any, { jobId: string | undefined }>({
      query: (jobId) => {
        return {
          url: `/job-openings/${jobId.jobId}`,
          method: 'GET'
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
      query: (Job) => {
        return {
          url: `/jobs/create`,
          method: 'POST',
          data: Job
        }
      },
      invalidatesTags: ['job-list']
    }),
    updateJob: build.mutation<void, Job>({
      query: (Job) => {
        return {
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
    }),
    applyJob: build.mutation<void, { jobId: string }>({
      query: ({ jobId }) => {
        return {
          url: `/jobs/apply/${jobId}`,
          method: 'PATCH'
        }
      },
      invalidatesTags: ['job-list']
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
      providesTags: ['job-list']
    }),
    withdrawJobApplication: build.mutation<void, { jobId: string }>({
      query: ({ jobId }) => {
        return {
          url: `/jobs/withdraw/${jobId}`,
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
  useFetchJobOpeningQuery,
  useFetchJobDetailsByIdQuery,
  useApplyJobMutation,
  useGetAppliedJobsQuery,
  useWithdrawJobApplicationMutation
} = jobApiSlice

export default jobApiSlice
