import whatsappApi from '../../api/whatsappApi'
import { FacebookBusinessResponse, TokenRequest } from './types'

const whatsappApiSlice = whatsappApi.injectEndpoints({
  endpoints: build => ({
    facebookExchageToken: build.mutation<
      void,
      { TokenRequestDTO: TokenRequest }
    >({
      query: ({ TokenRequestDTO }) => {
        return {
          url: `/whatsapp/exchange_token`,
          method: 'POST',
          data: TokenRequestDTO,
        }
      },
      invalidatesTags: ['whatsapp-config'],
    }),
    getBusinessInfo: build.query<FacebookBusinessResponse, void>({
      query: () => {
        return {
          url: `/whatsapp/business_info`,
          method: 'GET',
        }
      },
      providesTags: ['whatsapp-config'],
    }),
    deleteWhatsAppConfig: build.mutation<void, { whatsappBusinessID: string }>({
      query: ({ whatsappBusinessID }) => ({
        url: `/whatsapp/delete-config/${whatsappBusinessID}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['whatsapp-config'],
    }),
  }),
})

export const {
  useDeleteWhatsAppConfigMutation,
  useFacebookExchageTokenMutation,
  useGetBusinessInfoQuery,
} = whatsappApiSlice

export default whatsappApiSlice
