const Recruiter = require('../models/Recruiter')
const User = require('../models/User')
const { format } = require('date-fns')
const path = require('path')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

exports.getAllRecruiters = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let recruiterQuery = {}
    if (search) {
      recruiterQuery = {
        $or: [
          { companyName: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ],
      }
    }

    const recruiters = await Recruiter.find(recruiterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const formattedRecruiters = recruiters.map(recruiter => {
      const { userId, ...recruiterData } = recruiter.toObject()
      return {
        ...recruiterData,
        recruiterId: userId._id,
        name: userId?.name || '',
        email: userId?.email || '',
        companyName: recruiter.companyName || '-',
        aboutUs: recruiter.aboutUs || '-',
        companyWebsite: recruiter.companyWebsite || '-',
        linkedIn: recruiter.linkedIn || '-',
        profilePhoto: recruiter.profilePhoto || '-',
        address: recruiter.address || '-',
        createdAt: format(new Date(recruiter.createdAt), 'dd-MMM-yyyy'),
      }
    })

    const totalElements = await Recruiter.countDocuments(recruiterQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedRecruiters,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: true,
        empty: recruiters.length === 0,
        unsorted: false,
      },
      numberOfElements: recruiters.length,
      first: page === 0,
      empty: recruiters.length === 0,
    })
  } catch (error) {
    console.error('Error fetching recruiters:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

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
    let tempPath
    if (profilePhoto) {
      tempPath = path.join(__dirname, '../temp', profilePhoto?.name)
      await profilePhoto.mv(tempPath)
      const fileName = profilePhoto.name.replace(/\.[^/.]+$/, '')
      uploadedImage = await uploadImageToCloudinary(
        tempPath,
        process.env.FOLDER_NAME,
        fileName,
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
    if (fs.existsSync(tempPath) && profilePhoto) {
      fs.unlinkSync(tempPath)
    }
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

exports.getRecruiterStats = async (req, res) => {
  try {
    // Get total recruiter count
    const totalRecruiters = await Recruiter.countDocuments()

    // Get recruiter count per year based on the 'createdAt' field
    const recruiterCountPerYear = await Recruiter.aggregate([
      {
        $project: {
          year: { $year: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by year in ascending order
    ])

    return res.status(200).json({
      success: true,
      totalRecruiters,
      recruiterCountPerYear,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
