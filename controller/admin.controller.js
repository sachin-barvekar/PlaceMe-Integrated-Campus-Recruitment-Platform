const Admin = require('../models/Admin')
const User = require('../models/User')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
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
      !!admin.profilePhoto

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
      !!admin.profilePhoto

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

exports.skillMappingByAdmin = async (req, res) => {
  try {
    const csvFile = req.files.file
    if (!csvFile) {
      return res
        .status(400)
        .json({ success: false, message: 'No CSV file uploaded' })
    }

    const tempPath = path.join(__dirname, '../temp', csvFile.name)
    if (!fs.existsSync(path.dirname(tempPath)))
      fs.mkdirSync(path.dirname(tempPath), { recursive: true })
    await csvFile.mv(tempPath)
    res.status(202).json({
      success: true,
      message: 'CSV uploaded. Model retraining started in the background.',
    })
    const extract = spawn('python', ['ml/fetch_job_data.py', tempPath])
    let data = ''
    let errorData = ''

    extract.stdout.on('data', chunk => (data += chunk.toString()))
    extract.stderr.on('data', chunk => (errorData += chunk.toString()))

    extract.on('close', async () => {
      fs.unlinkSync(tempPath)

      if (errorData) {
        return res.status(500).json({
          success: false,
          message: 'Python script error (fetch_job_data)',
          error: errorData,
        })
      }

      try {
        const parsed = JSON.parse(data)
        const encodedData = Buffer.from(JSON.stringify(parsed)).toString(
          'base64',
        )

        const retrain = spawn('python', ['ml/retrain_model.py', encodedData])
        let retrainOut = ''
        let retrainErr = ''

        retrain.stdout.on('data', chunk => (retrainOut += chunk.toString()))
        retrain.stderr.on('data', chunk => (retrainErr += chunk.toString()))

        retrain.on('close', () => {
          if (retrainErr) {
            return res.status(500).json({
              success: false,
              message: 'Retraining failed',
              error: retrainErr,
            })
          }

          return res.status(200).json({
            success: true,
            message: 'CSV processed and model retrained successfully',
            parsedData: parsed,
            retrainLogs: retrainOut,
          })
        })
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to parse Python output (JSON parsing failed)',
          error: err.message,
        })
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
