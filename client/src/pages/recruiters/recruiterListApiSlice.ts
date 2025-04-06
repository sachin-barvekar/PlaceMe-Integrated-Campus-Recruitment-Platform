import { IListApiRequest, IListApiResponse } from '../../api/types'
import recruiterApi from '../../api/recruiterApi'
import { Recruiter } from './types'
import { getPaginationQueryParams } from './utils'

const recruiterApiSlice = recruiterApi.injectEndpoints({
  endpoints: build => ({
    fetchRecruiterList: build.query<
      IListApiResponse<Recruiter>,
      IListApiRequest<Recruiter>
    >({
      query: request => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/recruiters',
          method: 'GET',
          params,
        }
      },
      providesTags: ['recruiter-list'],
    }),
  }),
})

export const { useFetchRecruiterListQuery } = recruiterApiSlice

export default recruiterApiSlice
