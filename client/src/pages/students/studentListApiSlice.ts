import studentApi from '../../api/studentApi'
import { IListApiRequest, IListApiResponse } from '../../api/types'
import { getPaginationQueryParams } from './utils'
import { Students } from './types'

const StudentApiSlice = studentApi.injectEndpoints({
  endpoints: build => ({
    fetchStudentsList: build.query<
      IListApiResponse<Students>,
      IListApiRequest<Students>
    >({
      query: request => {
        const params = getPaginationQueryParams(request)
        return {
          url: '/students',
          method: 'GET',
          params,
        }
      },
      providesTags: ['student-list'],
    }),
  }),
})

export const { useFetchStudentsListQuery } = StudentApiSlice

export default StudentApiSlice
