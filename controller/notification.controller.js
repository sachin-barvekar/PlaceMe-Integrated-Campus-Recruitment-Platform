const Notification = require('../models/Notification')
const User = require('../models/User')

exports.getUserNotifications = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const userId = user._id

    const notifications = await Notification.find({ recipientIds: userId })
      .sort({ createdAt: -1 })
      .select('-recipientIds')

    return res.status(200).json({
      success: true,
      notifications,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
