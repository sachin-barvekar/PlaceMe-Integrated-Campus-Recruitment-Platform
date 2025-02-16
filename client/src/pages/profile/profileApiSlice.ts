import profileApi from 'api/profileApi'
import { StudentProfileResponse, StudentSaveRequest } from './types'

const profileApiSlice = profileApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<
      StudentProfileResponse,
      { firebaseUid: string | undefined }
    >({
      query: ({ firebaseUid }) => ({
        url: `/student-profile/${firebaseUid}`,
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
          url: `/student-profile/${studentDTO.userId}`,
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
        const studentBlob = new Blob([JSON.stringify(studentDTO)], {
          type: 'application/json'
        })
        formData.append('studentDTO', studentBlob)
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/student-profile/${studentDTO.userId}`,
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
