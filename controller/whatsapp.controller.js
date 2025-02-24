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

    const response = await fetch(
      'https://graph.facebook.com/v21.0/oauth/access_token',
      {
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
      },
    )

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

exports.getBusinessInfo = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user._id

    const business = await WhatsApp.findOne({ userId: uid })

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'WhatsApp Business not found for this user',
      })
    }

    const { whatsappBusinessID, accessToken } = business

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${whatsappBusinessID}?fields=id,name,currency,owner_business_info&access_token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response from Facebook API:', errorText)
      return res.status(response.status).json({ error: `Error: ${errorText}` })
    }

    const data = await response.json()

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Error fetching business info:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.deleteWhatsAppBusinessAccount = async (req, res) => {
  try {
    const { whatsappBusinessID } = req.params
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user._id

    const deletedBusiness = await WhatsApp.findOneAndDelete({
      whatsappBusinessID,
      userId: uid,
    })

    if (!deletedBusiness) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'WhatsApp Business Account Business not found',
        })
    }

    return res
      .status(200)
      .json({
        success: true,
        message: 'WhatsApp Business Account deleted successfully',
      })
  } catch (error) {
    console.error('Error deleting business:', error)
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' })
  }
}
