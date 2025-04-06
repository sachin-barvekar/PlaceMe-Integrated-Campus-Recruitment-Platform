import { FC, useEffect, useState } from 'react'
import { Button, Loader, Modal, Toolbar } from '../../../shared'
import { FbAuthProvider } from '../../../hooks/facebook'
import '../../../scss/common/list/List.scss'
import { notifyError, notifySuccess } from '../../../utils'
import { initFacebookSDK } from '../../../config/facebook'
import './whatsappconfig.scss'
import TrashIcon from '@rsuite/icons/Trash'
import { FaWhatsapp } from 'react-icons/fa'
import { ButtonToolbar } from 'rsuite'
import { FacebookBusinessResponse, TokenRequest } from '../types'
import {
  useDeleteWhatsAppConfigMutation,
  useFacebookExchageTokenMutation,
  useGetBusinessInfoQuery,
} from '../whatsappApiSlice'

const WhatsAppConfig: FC = () => {
  const options = [{ label: 'WhatsApp Config', value: '', onClick: () => {} }]
  const { data, isFetching } = useGetBusinessInfoQuery()
  const [businessInfo, setBusinessInfo] = useState<
    FacebookBusinessResponse | undefined
  >(data)

  useEffect(() => {
    setBusinessInfo(data)
  }, [data])

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [showOnboardingMessage, setShowOnboardingMessage] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboardingMessage(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [data])

  useEffect(() => {
    initFacebookSDK()
      .then(() => setSdkLoaded(true))
      .catch(() => setSdkLoaded(false))
  }, [])

  const [whatsAppConfig] = useFacebookExchageTokenMutation()
  const [DeleteWhatsAppconfig] = useDeleteWhatsAppConfigMutation()

  const { phoneId, whatsappid, resCode, launchWhatsAppSignup } =
    FbAuthProvider()
  useEffect(() => {
    if (phoneId && whatsappid && resCode) {
      const tokenRequest: TokenRequest = {
        phoneNumberId: phoneId,
        whatsappBusinessID: whatsappid,
        code: resCode,
      }
      whatsAppConfig({ TokenRequestDTO: tokenRequest })
        .then(() => {
          notifySuccess('WhatsApp Account Connected Successfully')
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          notifyError(error ?? 'Error creating WhatsApp config')
        })
    }
    // eslint-disable-next-line
  }, [phoneId, whatsappid, resCode, WhatsAppConfig])

  const handleDeleteconfig = async (whatsappBusinessID: string | undefined) => {
    if (!whatsappBusinessID) return
    try {
      if (whatsappBusinessID) {
        await DeleteWhatsAppconfig({ whatsappBusinessID }).unwrap()
        notifySuccess('WhatsApp config deleted successfully')
        setOpenDeleteModal(false)
        setBusinessInfo(undefined)
      } else {
        notifyError('WhatsApp config ID is undefined')
        setOpenDeleteModal(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifyError('Failed to delete config')
      setOpenDeleteModal(false)
    }
  }
  const renderFormButtons = () => (
    <ButtonToolbar>
      <Button
        className='formButton'
        id='reset'
        onClick={() => setOpenDeleteModal(false)}>
        No
      </Button>
      <Button
        className='formButton'
        appearance='primary'
        type='submit'
        onClick={() => {
          handleDeleteconfig(businessInfo?.data?.id)
        }}>
        Yes
      </Button>
    </ButtonToolbar>
  )

  return (
    <div className='list'>
      <Toolbar options={options} total={1} />
      <div className='list__main-container'>
        {isFetching && <Loader />}
        {!businessInfo && showOnboardingMessage && !isFetching && (
          <div className='wp-config-card-container'>
            <div className='card-header'>
              <h3>No whatsApp account connected yet</h3>
            </div>
            <p>Link your WhatsApp Business account to PlaceMe.</p>
            <Button
              appearance='primary'
              onClick={launchWhatsAppSignup}
              disabled={!sdkLoaded}>
              {sdkLoaded ? 'Login with Facebook' : 'Loading...'}
            </Button>
          </div>
        )}
        {businessInfo && !isFetching && (
          <div className='wp-config-card-container'>
            <div className='channel-disconnect'>
              <div className='button'>
                <Button
                  size='md'
                  appearance='primary'
                  onClick={() => {
                    setOpenDeleteModal(true)
                  }}>
                  <TrashIcon />
                </Button>
              </div>
            </div>

            <p>Your WhatsApp Business account is connected with PlaceMe.</p>
            <div className='card-header'>
              <FaWhatsapp size={22} />
              <h3>{businessInfo?.data?.name ?? '-'}</h3>
            </div>
            <div className='card-body'>
              <div className='business-card__item'>
                <b>WhatsApp Business ID: </b>

                <p> {businessInfo?.data?.id}</p>
              </div>
              <div className='business-card__item'>
                <b>Business Name: </b>
                <p>{businessInfo?.data?.owner_business_info?.name}</p>
              </div>
            </div>
          </div>
        )}
        <Modal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          title='Confirm Delete'
          size='sm'
          className='delete-modal'
          body={
            <div>
              <p className='modal-text'>
                Are you sure you want to delete this WhatsApp Config?
              </p>
              <div className='modal-buttons'>{renderFormButtons()}</div>
            </div>
          }
        />
      </div>
    </div>
  )
}
export default WhatsAppConfig
