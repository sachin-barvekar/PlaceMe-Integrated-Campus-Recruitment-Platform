import profileApi from '../../api/profileApi'
import {
  AdminProfileResponse,
  AdminProfileSaveRequest,
  RecruiterProfileResponse,
  RecruiterProfileSaveRequest,
  StudentProfileResponse,
  StudentSaveRequest,
} from './types'

const profileApiSlice = profileApi.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<StudentProfileResponse, void>({
      query: () => ({
        url: `/student-profile`,
        method: 'GET',
      }),
      providesTags: ['student-profile'],
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
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['student-profile'],
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
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['student-profile'],
    }),

    getAdminProfile: build.query<AdminProfileResponse, void>({
      query: () => ({
        url: `/admin-profile`,
        method: 'GET',
      }),
      providesTags: ['admin-profile'],
    }),
    createAdminProfile: build.mutation<void, AdminProfileSaveRequest>({
      query: ({ adminDTO, file }) => {
        const formData = new FormData()
        formData.append('adminDTO', JSON.stringify(adminDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/admin-profile`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['admin-profile'],
    }),
    updateAdminProfile: build.mutation<void, AdminProfileSaveRequest>({
      query: ({ adminDTO, file }) => {
        const formData = new FormData()
        formData.append('adminDTO', JSON.stringify(adminDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/admin-profile`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['admin-profile'],
    }),
    getRecruiterProfile: build.query<RecruiterProfileResponse, void>({
      query: () => ({
        url: `/recruiter-profile`,
        method: 'GET',
      }),
      providesTags: ['recruiter-profile'],
    }),
    createRecruiterProfile: build.mutation<void, RecruiterProfileSaveRequest>({
      query: ({ recruiterDTO, file }) => {
        const formData = new FormData()
        formData.append('recruiterDTO', JSON.stringify(recruiterDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/recruiter-profile`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['recruiter-profile'],
    }),
    updateRecruiterProfile: build.mutation<void, RecruiterProfileSaveRequest>({
      query: ({ recruiterDTO, file }) => {
        const formData = new FormData()
        formData.append('recruiterDTO', JSON.stringify(recruiterDTO))
        if (file instanceof File) {
          formData.append('file', file)
        }
        return {
          url: `/recruiter-profile`,
          method: 'PUT',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['recruiter-profile'],
    }),
  }),
})

export const {
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useCreateAdminProfileMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetRecruiterProfileQuery,
  useCreateRecruiterProfileMutation,
  useUpdateRecruiterProfileMutation,
} = profileApiSlice
