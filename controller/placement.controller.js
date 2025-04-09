const Placement = require('../models/Placement')
const Student = require('../models/Student')
const Recruiter = require('../models/Recruiter')
const User = require('../models/User')
const Job = require('../models/Job')
const { sendEmail } = require('../utils/sendEmail')
const Notification = require('../models/Notification')
const admin = require('../config/firebaseAdmin')

exports.createPlacement = async (req, res) => {
  try {
    const {
      studentId,
      companyId,
      companyName,
      jobRole,
      package,
      location,
      status,
    } = req.body

    const student = await User.findById(studentId)
    if (!student || student.role !== 'student') {
      return res
        .status(400)
        .json({ error: 'Invalid studentId: Must be a student' })
    }

    if (companyId) {
      const company = await User.findById(companyId)
      if (!company || company.role !== 'recruiter') {
        return res
          .status(400)
          .json({ error: 'Invalid companyId: Must be a recruiter' })
      }
    }
    if (!companyId && !companyName) {
      return res
        .status(400)
        .json({ error: 'Either companyId or companyName is required' })
    }
    if (companyId && companyName) {
      return res
        .status(400)
        .json({ error: 'Provide either companyId or companyName, not both' })
    }

    const placement = new Placement({
      studentId,
      companyId,
      companyName,
      jobRole,
      package,
      location,
      status,
    })
    await placement.save()

    res
      .status(201)
      .json({ message: 'Placement created successfully', placement })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllPlacements = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let searchQuery = {}
    if (search) {
      searchQuery = {
        $or: [
          { 'studentId.name': { $regex: search, $options: 'i' } },
          { 'companyId.name': { $regex: search, $options: 'i' } },
        ],
      }
    }

    const matchingStudents = await User.find({
      name: { $regex: search, $options: 'i' },
    }).select('_id')

    const matchingCompanies = await Placement.find({
      name: { $regex: search, $options: 'i' },
    }).select('_id')

    const placementQuery = {
      $or: [
        { studentId: { $in: matchingStudents.map(s => s._id) } },
        { companyId: { $in: matchingCompanies.map(c => c._id) } },
        { companyName: { $regex: search, $options: 'i' } },
      ],
    }

    const placements = await Placement.find(placementQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('studentId', 'name email')
      .populate('companyId', 'name email')

    const formattedPlacements = await Promise.all(
      placements.map(async placement => {
        const student = await Student.findOne({
          userId: placement.studentId._id,
        })

        return {
          _id: placement._id,
          studentId: placement.studentId._id,
          studentName: placement.studentId?.name || '-',
          studentEmail: placement.studentId?.email || '-',
          branch: student?.branch || '-',
          profilePhoto: student?.profilePhoto || '-',
          companyName: placement.companyName,
          jobRole: placement.jobRole,
          package: placement.package,
          location: placement.location,
          status: placement.status,
          createdAt: placement.createdAt,
        }
      }),
    )

    const totalElements = await Placement.countDocuments(placementQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedPlacements,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: placements.length === 0,
        unsorted: true,
      },
      numberOfElements: placements.length,
      first: page === 0,
      empty: placements.length === 0,
    })
  } catch (error) {
    console.error('Error fetching placements:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.updatePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true, runValidators: true },
    )
    if (!placement) {
      return res.status(404).json({ error: 'Placement not found' })
    }
    res
      .status(200)
      .json({ message: 'Placement updated successfully', placement })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params._id)
    if (!placement) {
      return res.status(404).json({ error: 'Placement not found' })
    }
    res.status(200).json({ message: 'Placement deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.addPlacementbyRecruiter = async (req, res) => {
  try {
    const { studentId, jobRole, jobId, package, location } = req.body
    const student = await User.findById(studentId)
    const job = await Job.findById(jobId)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (!student) return res.status(404).json({ error: 'Student not found' })
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const companyId = user?._id
    let recruiter = await Recruiter.findOne({ userId: companyId })
    const { companyName } = recruiter
    const existingPlacement = await Placement.findOne({
      studentId,
      jobId,
      status: 'Placed',
    })
    if (existingPlacement) {
      return res.status(400).json({
        success: false,
        message: 'Student is already selected for this job.',
      })
    }
    const newPlacement = await Placement.create({
      jobId,
      studentId,
      companyId,
      jobRole,
      package,
      location,
      status: 'Placed',
    })

    const subject = `🎉 You're placed at ${companyName}!`
    const message = `
Hi ${student.name},

Congratulations! You’ve been placed at ${companyName} for the role of ${jobRole} with a package of ${package}.

Best wishes for your journey ahead!

Regards,  
Team TechThinker`

    await sendEmail({
      to: student.email,
      subject,
      text: message,
    })

    if (student.fcmToken) {
      const fcmMessage = {
        notification: {
          title: '🎉 Congratulations! You’ve Been Selected!',
          body: `🎉 Congratulations! You’ve Been Selected! at ${companyName} as ${jobRole}.`,
        },
        token: student.fcmToken,
      }

      await admin.messaging().send(fcmMessage)

      const placementNotification = new Notification({
        title: '🎉 Congratulations! You’ve Been Selected!',
        message: `🎉 Congratulations! You’ve Been Selected! at ${companyName} as ${jobRole}.`,
        createdBy: companyId,
        recipientIds: [student._id],
      })
      await placementNotification.save()
    }

    res.status(201).json({
      success: true,
      message: 'Student has been successfully selected and notified via email.',
      placement: newPlacement,
    })
  } catch (error) {
    console.error('Placement error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

exports.getAllPlacementsByRecruiter = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const recruiterId = user?._id
    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    const matchingStudents = await User.find({
      name: { $regex: search, $options: 'i' },
    }).select('_id')

    const matchingCompanies = await Placement.find({
      name: { $regex: search, $options: 'i' },
    }).select('_id')

    let placementQuery = {
      $or: [
        { studentId: { $in: matchingStudents.map(s => s._id) } },
        { companyId: { $in: matchingCompanies.map(c => c._id) } },
        { companyName: { $regex: search, $options: 'i' } },
      ],
    }

    if (recruiterId) {
      placementQuery.companyId = recruiterId
    }

    const placements = await Placement.find(placementQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('studentId', 'name email')
      .populate('companyId', 'name email')

    const formattedPlacements = await Promise.all(
      placements.map(async placement => {
        const student = await Student.findOne({
          userId: placement.studentId._id,
        })

        return {
          _id: placement._id,
          studentId: placement.studentId._id,
          studentName: placement.studentId?.name || '-',
          studentEmail: placement.studentId?.email || '-',
          branch: student?.branch || '-',
          profilePhoto: student?.profilePhoto || '-',
          companyName: placement.companyName,
          jobRole: placement.jobRole,
          package: placement.package,
          location: placement.location,
          status: placement.status,
          createdAt: placement.createdAt,
        }
      }),
    )

    const totalElements = await Placement.countDocuments(placementQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedPlacements,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: placements.length === 0,
        unsorted: true,
      },
      numberOfElements: placements.length,
      first: page === 0,
      empty: placements.length === 0,
    })
  } catch (error) {
    console.error('Error fetching placements:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
