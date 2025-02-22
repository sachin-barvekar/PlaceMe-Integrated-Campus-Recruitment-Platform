const Student = require('../models/Student')
const User = require('../models/User')
const { format } = require('date-fns')
const { uploadImageToCloudinary } = require('../utils/imageUploader')

exports.getAllStudents = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let userQuery = {}
    if (search) {
      userQuery = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } },
        ],
      }
    }

    const matchingUsers = await User.find(userQuery).select('_id')
    const students = await Student.find({
      userId: { $in: matchingUsers.map(user => user._id) },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const formattedStudents = students.map(student => {
      const { userId, ...studentData } = student.toObject()
      return {
        ...studentData,
        dateOfBirth:
          student.dateOfBirth && !isNaN(new Date(student.dateOfBirth))
            ? format(new Date(student.dateOfBirth), 'dd-MMM-yyyy')
            : '-',
        name: userId?.name || '',
        email: userId?.email || '',
      }
    })

    const totalElements = await Student.countDocuments({
      userId: { $in: matchingUsers.map(user => user._id) },
    })
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedStudents,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: students.length === 0,
        unsorted: true,
      },
      numberOfElements: students.length,
      first: page === 0,
      empty: students.length === 0,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.StudentProfileCompletion = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id;
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const uid = user?._id
    let student = await Student.findOne({ userId: uid }).populate('userId')

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
      !!student.skills &&
      !!student.linkedIn &&
      !!student.github

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
    const firebaseUid = req.user.user_id;
    const studentData = JSON.parse(req.body.studentDTO)
    const {
      mobile,
      gender,
      dateOfBirth,
      branch,
      address,
      academicDetails,
      skills,
      linkedIn,
      github,
    } = studentData

    const profilePhoto = req.files?.file
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const uid = user?._id
    let student = await Student.findOne({ userId: uid })

    let uploadedImage
    if (profilePhoto) {
      uploadedImage = await uploadImageToCloudinary(
        profilePhoto,
        process.env.FOLDER_NAME,
      )
    }

    if (!student) {
      student = new Student({
        userId: uid,
        mobile,
        gender,
        dateOfBirth,
        branch,
        address,
        profilePhoto: uploadedImage ? uploadedImage.secure_url : '',
        academicDetails,
        skills,
        linkedIn,
        github,
      })
    } else {
      student.mobile = mobile
      student.gender = gender
      student.dateOfBirth = dateOfBirth
      student.branch = branch
      student.address = address
      if (uploadedImage) student.profilePhoto = uploadedImage.secure_url
      student.academicDetails = academicDetails
      student.skills = skills
      student.linkedIn = linkedIn
      student.github = github
    }

    const isComplete =
      !!student.mobile &&
      !!student.gender &&
      !!student.dateOfBirth &&
      !!student.branch &&
      !!student.address &&
      !!student.profilePhoto &&
      student.academicDetails.length > 0 &&
      !!student.skills &&
      !!student.linkedIn &&
      !!student.github

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
