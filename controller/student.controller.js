const Student = require('../models/Student')
const User = require('../models/User')
const Placement = require('../models/Placement')
const { format } = require('date-fns')
const { uploadImageToCloudinary } = require('../utils/imageUploader')
const { spawn } = require('child_process')
const predictPlacementScore = require('../ml/run_predictor')
const path = require('path')
const fs = require('fs')

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
        userId,
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
    const firebaseUid = req.user.user_id
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
      !!student.CGPA

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
    const firebaseUid = req.user.user_id
    const studentData = JSON.parse(req.body.studentDTO)
    const {
      mobile,
      gender,
      dateOfBirth,
      branch,
      address,
      academicDetails,
      CGPA,
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
        CGPA,
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
      student.CGPA = CGPA
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
      !!student.CGPA

    student.profileCompletion = isComplete
    await student.save()

    if (fs.existsSync(tempPath) && profilePhoto) {
      fs.unlinkSync(tempPath)
    }
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

exports.getStudentQueries = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments()

    const placedStudents = await Placement.countDocuments()

    const placementPercentage =
      totalStudents > 0
        ? ((placedStudents / totalStudents) * 100).toFixed(2)
        : 0

    const branchWisePlacement = await Placement.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: 'userId',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $group: {
          _id: '$studentDetails.branch',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          branch: '$_id',
          count: 1,
        },
      },
    ])

    const getHighestPackageData = async () => {
      const currentYear = new Date().getFullYear()
      const startYear = currentYear - 5

      const highestPackages = await Placement.aggregate([
        {
          $project: {
            year: { $year: '$createdAt' },
            numericPackage: {
              $convert: {
                input: {
                  $replaceAll: {
                    input: '$package',
                    find: ' LPA',
                    replacement: '',
                  },
                },
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            },
            companyName: 1,
          },
        },
        {
          $sort: { numericPackage: -1 },
        },
        {
          $group: {
            _id: '$year',
            package: { $first: '$numericPackage' },
            company: { $first: '$companyName' },
          },
        },
        { $sort: { _id: 1 } },
      ])

      const packageData = []
      for (let year = startYear; year <= currentYear; year++) {
        const found = highestPackages.find(p => p._id === year)
        packageData.push({
          year,
          package: found ? found.package : 0,
          company: found ? found.company : null,
        })
      }

      return packageData
    }

    const highestPackageData = await getHighestPackageData()
    return res.status(200).json({
      success: true,
      totalStudents,
      placedStudents,
      placementPercentage,
      branchWisePlacement,
      highestPackageData,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.getStudentProfileById = async (req, res) => {
  try {
    const { userId } = req.params
    const student = await Student.findOne({ userId }).populate('userId')

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        student: null,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile fetched successfully',
      student,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.uploadStudentResume = async (req, res) => {
  try {
    const resumeFile = req.files?.resume
    if (!resumeFile) {
      return res
        .status(400)
        .json({ success: false, message: 'No resume file uploaded' })
    }

    const tempPath = path.join(__dirname, '../temp', resumeFile.name)
    await resumeFile.mv(tempPath)
    const fileName = resumeFile.name.replace(/\.[^/.]+$/, '')
    const uploadedResume = await uploadImageToCloudinary(
      tempPath,
      process.env.RESUMEFOLDER_NAME,
      fileName,
    )
    const py = spawn('python', ['ml/extract_skills.py', tempPath])
    let data = ''
    let errorData = ''

    py.stdout.on('data', chunk => {
      data += chunk.toString()
    })

    py.stderr.on('data', err => {
      errorData += err.toString()
    })

    py.on('close', async code => {
      try {
        fs.unlinkSync(tempPath)

        if (errorData) {
          return res.status(500).json({
            success: false,
            message: 'Error extracting skills from resume',
          })
        }

        if (!data) {
          return res
            .status(500)
            .json({ success: false, message: 'No output from Python script' })
        }

        const parsed = JSON.parse(data)
        const skills = parsed.skills || []

        const firebaseUid = req.user.user_id

        const user = await User.findOne({ firebaseUid })
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' })
        }

        const student = await Student.findOne({ userId: user._id })
        if (!student) {
          return res
            .status(404)
            .json({ success: false, message: 'Student not found' })
        }

        student.skills = skills
        student.resume = uploadedResume.secure_url
        await student.save()

        return res.status(200).json({
          success: true,
          message: 'Resume uploaded and skills extracted',
          skills,
        })
      } catch (err) {
        console.error('DEBUG 20: Error after Python close:', err)
        return res.status(500).json({ success: false, message: err.message })
      }
    })

    py.on('error', err => {
      console.error('DEBUG 21: Python process failed to start:', err)
      return res
        .status(500)
        .json({ success: false, message: 'Failed to run Python script' })
    })
  } catch (err) {
    console.error('DEBUG 22: Unexpected error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

exports.calculatePlacementScoreForStudent = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const student = await Student.findOne({ userId: user._id })
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' })
    }

    // Prepare input for ML model
    const input = {
      cgpa: student.CGPA ?? 0,
      skills: student.skills ?? [],
    }

    const { placementScore, role, reason, suggestions } =
      await predictPlacementScore(input)

    res.status(200).json({
      placementScore,
      role,
      reason,
      suggestions,
      skills: student?.skills,
    })
  } catch (error) {
    console.error('Error in calculatePlacementScoreForStudent:', error)
    res
      .status(500)
      .json({ error: 'Failed to calculate placement score for student' })
  }
}
