import settingsApi from '../../api/settingsApi'

const settingsApiSlice = settingsApi.injectEndpoints({
  endpoints: build => ({
    skillMappingByAdmin: build.mutation<void, File>({
      query: file => {
        const formData = new FormData()
        formData.append('file', file)

        return {
          url: `/skill-mapping-by-admin`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      },
      invalidatesTags: ['skill-mapping'],
    }),
  }),
})

export const { useSkillMappingByAdminMutation } = settingsApiSlice
export default settingsApiSlice
