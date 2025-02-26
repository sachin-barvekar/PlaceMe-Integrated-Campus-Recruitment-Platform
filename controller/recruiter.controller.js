const Recruiter = require('../models/Recruiter')
const User = require('../models/User')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

exports.RecruiterProfileCompletion = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user?._id
    let recruiter = await Recruiter.findOne({ userId: uid }).populate('userId')

    if (!recruiter) {
      return res.status(200).json({
        success: true,
        profileCompletion: false,
        message: 'Recruiter profile not found',
        recruiter: null,
      })
    }

    const isComplete = !!recruiter.companyName && !!recruiter.address

    if (recruiter.profileCompletion !== isComplete) {
      recruiter.profileCompletion = isComplete
      await recruiter.save()
    }

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile is complete'
        : 'Profile is incomplete, please update it.',
      recruiter,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.addOrEditRecruiterProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const recruiterData = JSON.parse(req.body.recruiterDTO)
    const { companyName, aboutUs, companyWebsite, linkedIn, address } =
      recruiterData

    const profilePhoto = req.files?.file
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const uid = user?._id
    let recruiter = await Recruiter.findOne({ userId: uid })

    let uploadedImage
    if (profilePhoto) {
      uploadedImage = await uploadImageToCloudinary(
        profilePhoto,
        process.env.FOLDER_NAME,
      )
    }

    if (!recruiter) {
      recruiter = new Recruiter({
        userId: uid,
        companyName,
        aboutUs,
        companyWebsite,
        linkedIn,
        address,
        profilePhoto: uploadedImage ? uploadedImage.secure_url : '',
      })
    } else {
      recruiter.companyName = companyName
      recruiter.aboutUs = aboutUs
      recruiter.companyWebsite = companyWebsite
      recruiter.linkedIn = linkedIn
      recruiter.address = address
      if (uploadedImage) recruiter.profilePhoto = uploadedImage.secure_url
    }

    const isComplete = !!recruiter.companyName && !!recruiter.address

    recruiter.profileCompletion = isComplete
    await recruiter.save()

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile updated successfully'
        : 'Profile is incomplete, please update it.',
      recruiter,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
