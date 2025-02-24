const Admin = require('../models/Admin')
const User = require('../models/User')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

exports.AdminProfileCompletion = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const uid = user?._id
    let admin = await Admin.findOne({ userId: uid }).populate('userId')

    if (!admin) {
      return res.status(200).json({
        success: true,
        profileCompletion: false,
        message: 'Admin profile not found',
        admin: null,
      })
    }

    const isComplete =
      !!admin.mobile &&
      !!admin.gender &&
      !!admin.position &&
      !!admin.collegeName &&
      !!admin.collegeAddress &&
      !!admin.profilePhoto &&
      !!admin.linkedIn

    if (admin.profileCompletion !== isComplete) {
      admin.profileCompletion = isComplete
      await admin.save()
    }

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile is complete'
        : 'Profile is incomplete, please update it.',
      admin,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.addOrEditAdminProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const adminData = JSON.parse(req.body.adminDTO)
    const { mobile, gender, position, collegeName, collegeAddress, linkedIn } =
      adminData

    const profilePhoto = req.files?.file
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user?._id
    let admin = await Admin.findOne({ userId: uid })

    let uploadedImage
    if (profilePhoto) {
      uploadedImage = await uploadImageToCloudinary(
        profilePhoto,
        process.env.FOLDER_NAME,
      )
    }

    if (!admin) {
      admin = new Admin({
        userId: uid,
        mobile,
        gender,
        position,
        collegeName,
        collegeAddress,
        profilePhoto: uploadedImage ? uploadedImage.secure_url : '',
        linkedIn,
      })
    } else {
      admin.mobile = mobile
      admin.gender = gender
      admin.position = position
      admin.collegeName = collegeName
      admin.collegeAddress = collegeAddress
      if (uploadedImage) admin.profilePhoto = uploadedImage.secure_url
      admin.linkedIn = linkedIn
    }

    const isComplete =
      !!admin.mobile &&
      !!admin.gender &&
      !!admin.position &&
      !!admin.collegeName &&
      !!admin.collegeAddress &&
      !!admin.profilePhoto &&
      !!admin.linkedIn

    admin.profileCompletion = isComplete
    await admin.save()

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile updated successfully'
        : 'Profile is incomplete, please update it.',
      admin,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
