const User = require('../models/User')
const Student = require('../models/Student')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

exports.StudentProfileCompletion = async (req, res) => {
  try {
    const { firebaseUid } = req.params
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const uid = user?._id
    let student = await Student.findOne({ userId: uid })

    if (!student) {
      return res.status(200).json({
        success: true,
        profileCompletion: false,
        message: 'Student profile not found',
        student: null,
      })
    }

    const isComplete =
      !!student.mobile &&
      !!student.gender &&
      !!student.dateOfBirth &&
      !!student.branch &&
      !!student.address &&
      !!student.profilePhoto &&
      student.academicDetails.length > 0 &&
      !!student.skills

    if (student.profileCompletion !== isComplete) {
      student.profileCompletion = isComplete
      await student.save()
    }

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile is complete'
        : 'Profile is incomplete, please update it.',
      student,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.addOrEditStudentProfile = async (req, res) => {
  try {
    const { firebaseUid } = req.params
    const studentData = JSON.parse(req.body.studentDTO)
    console.log(studentData)
    const {
      mobile,
      gender,
      dateOfBirth,
      branch,
      address,
      academicDetails,
      skills,
    } = studentData
    console.log(req.body)
    const profilePhoto = req.files.file

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const uid = user?._id

    let student = await Student.findOne({ userId: uid })

    const uploadedImage = await uploadImageToCloudinary(
      profilePhoto,
      process.env.FOLDER_NAME,
    )

    if (!student) {
      student = new Student({
        userId: uid,
        mobile,
        gender,
        dateOfBirth,
        branch,
        address,
        profilePhoto: uploadedImage.secure_url,
        academicDetails,
        skills,
      })
    } else {
      student.mobile = mobile
      student.gender = gender
      student.dateOfBirth = dateOfBirth
      student.branch = branch
      student.address = address
      student.profilePhoto = uploadedImage.secure_url
      student.academicDetails = academicDetails
      student.skills = skills
    }

    const isComplete =
      !!student.mobile &&
      !!student.gender &&
      !!student.dateOfBirth &&
      !!student.branch &&
      !!student.address &&
      !!student.profilePhoto &&
      student.academicDetails.length > 0 &&
      !!student.skills

    student.profileCompletion = isComplete
    await student.save()

    return res.status(200).json({
      success: true,
      profileCompletion: isComplete,
      message: isComplete
        ? 'Profile updated successfully'
        : 'Profile is incomplete, please update it.',
      student,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
