const WhatsApp = require('../models/WhatsApp')
const User = require('../models/User')

exports.exchangeToken = async (req, res) => {
  try {
    const { code, whatsappBusinessID, phoneNumberId } = req.body
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user?._id

    const response = await fetch(process.env.FACEBOOK_ACCESS_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        grant_type: 'authorization_code',
        code,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response from Facebook API:', errorText)
      return res.status(response.status).json({ error: `Error: ${errorText}` })
    }

    const data = await response.json()

    if (data.access_token) {
      const accessToken = data.access_token

      const existingWhatsapp = await WhatsApp.findOne({ whatsappBusinessID })

      if (existingWhatsapp) {
        existingWhatsapp.accessToken = accessToken
        existingWhatsapp.phoneNumberId = phoneNumberId
        existingWhatsapp.userId = uid
        await existingWhatsapp.save()
      } else {
        const newWhatsapp = new WhatsApp({
          accessToken,
          phoneNumberId,
          whatsappBusinessID,
          userId: uid,
        })
        await newWhatsapp.save()
      }

      return res.status(200).json({ message: 'Token exchange successfully' })
    } else {
      return res.status(400).json({ error: 'Failed to exchange token' })
    }
  } catch (error) {
    console.error('Error exchanging token:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
