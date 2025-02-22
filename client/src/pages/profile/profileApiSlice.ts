import profileApi from 'api/profileApi'
import { StudentProfileResponse, StudentSaveRequest } from './types'

const profileApiSlice = profileApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<StudentProfileResponse, void>({
      query: () => ({
        url: `/student-profile`,
        method: 'GET'
      }),
      providesTags: ['profile']
    }),

    createProfile: build.mutation<void, StudentSaveRequest>({
      query: ({ studentDTO, file }) => {
        const formData = new FormData()
        formData.append('studentDTO', JSON.stringify(studentDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/student-profile`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      },
      invalidatesTags: ['profile']
    }),

    updateProfile: build.mutation<void, StudentSaveRequest>({
      query: ({ studentDTO, file }) => {
        const formData = new FormData()
        formData.append('studentDTO', JSON.stringify(studentDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/student-profile`,
          method: 'PUT',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      },
      invalidatesTags: ['profile']
    })
  })
})

export const {
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation
} = profileApiSlice
