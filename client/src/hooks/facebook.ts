import { useState, useEffect } from 'react'
import { notifyError, notifyWarning } from '../utils'

interface FbAuthProviderReturnType {
  phoneId: string;
  whatsappid: string;
  resCode: string;
  launchWhatsAppSignup: () => void;
}

export const FbAuthProvider = (): FbAuthProviderReturnType => {
  const [phoneId, setPhoneId] = useState<string>('')
  const [whatsappid, setWhatsappid] = useState<string>('')
  const [resCode, setResCode] = useState<string>('')

  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      notifyError('Facebook SDK not loaded')
      return
    }

    window.FB.login(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        if (response.authResponse) {
          setResCode(response.authResponse.code)
        } else {
          notifyWarning('User cancelled login or did not authorize.')
        }
      },
      {
        config_id: process.env.REACT_APP_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '2'
        }
      }
    )
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== 'https://www.facebook.com' &&
        event.origin !== 'https://web.facebook.com'
      ) {
        return
      }

      try {
        const data = JSON.parse(event.data)

        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data
            setPhoneId(phone_number_id)
            setWhatsappid(waba_id)
          } else if (data.event === 'CANCEL') {
            notifyWarning(
              `⚠️ User cancelled at step: ${data.data.current_step}`
            )
          } else if (data.event === 'ERROR') {
            notifyError('❌ Error:', data.data.error_message)
          }
        }
        // eslint-disable-next-line
      } catch (error) {}
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return {
    phoneId,
    whatsappid,
    resCode,
    launchWhatsAppSignup
  }
}
