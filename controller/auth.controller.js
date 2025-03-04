const User = require('../models/User')
require('dotenv').config()

exports.login = async (req, res) => {
  try {
    const { email, name, role, firebaseUid, fcmToken } = req.body

    if (!email || !role || !name || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: email, name, firebaseUid and role',
      })
    }

    let user = await User.findOne({ email })

    if (user) {
      if (user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `You are already registered with the role '${user.role}'. Please log in with the correct role.`,
        })
      }

      if (fcmToken) {
        user.fcmToken = fcmToken
        await user.save()
      }

      return res.status(200).json({
        success: true,
        user,
        message: 'User logged in successfully',
      })
    }

    user = await User.create({
      email,
      name,
      role,
      firebaseUid,
      fcmToken: fcmToken || null,
    })

    return res.status(201).json({
      success: true,
      user,
      message: 'User registered and logged in successfully',
    })
  } catch (error) {
    console.error('Error during login:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again later.',
    })
  }
}
