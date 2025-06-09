const Job = require('../models/Job')
const User = require('../models/User')
const Recruiter = require('../models/Recruiter')
const Notification = require('../models/Notification')
const { format } = require('date-fns')
const admin = require('../config/firebaseAdmin')

exports.addOrEditJob = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const userId = user?._id
    const recruiter = await Recruiter.findOne({ userId })

    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: 'Recruiter not found' })
    }
    const recruiterId = recruiter._id
    const jobData = req.body

    let job
    let isNewJob = false
    if (jobData._id) {
      job = await Job.findById(jobData._id)
      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: 'Job not found' })
      }
      if (job.recruiterId.toString() !== recruiterId.toString()) {
        return res
          .status(403)
          .json({ success: false, message: 'Unauthorized to edit this job' })
      }

      job.role = jobData.role
      job.jobDescription = jobData.jobDescription
      job.location = jobData.location
      job.jobType = jobData.jobType
      job.package = jobData.package
      job.skillsRequired = jobData.skillsRequired
      job.eligibilityCriteria = jobData.eligibilityCriteria
      job.lastDateToApply = jobData.lastDateToApply
      job.driveDate = jobData.driveDate
      job.active = jobData.active ?? job.active
    } else {
      job = new Job({
        recruiterId,
        role: jobData.role,
        jobDescription: jobData.jobDescription,
        location: jobData.location,
        jobType: jobData.jobType,
        package: jobData.package,
        skillsRequired: jobData.skillsRequired,
        eligibilityCriteria: jobData.eligibilityCriteria,
        lastDateToApply: jobData.lastDateToApply,
        driveDate: jobData.driveDate,
        active: jobData.active ?? true,
      })
      isNewJob = true
    }

    await job.save()
    if (isNewJob) {
      const students = await User.find({ role: 'student' })
      const recipientIds = students.map(s => s._id)
      const tokens = students.map(s => s.fcmToken)
      const notification = new Notification({
        title: 'New Job Posted',
        message: `A new job "${job.role}" is posted. Apply now!`,
        createdBy: recruiterId,
        recipientIds,
      })
      await notification.save()
      if (tokens.length > 0) {
        const message = {
          notification: {
            title: 'New Job Posted',
            body: `A new job "${job.role}" is posted. Apply now!`,
          },
          tokens,
        }
        await admin.messaging().sendEachForMulticast(message)
      }
    }

    return res.status(200).json({
      success: true,
      message: isNewJob
        ? 'Job created successfully'
        : 'Job updated successfully',
      job,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.getAllJobOpenings = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '', active } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let jobQuery = {}

    if (search) {
      const recruiters = await Recruiter.find({
        companyName: { $regex: search, $options: 'i' },
      }).select('_id')
      const recruiterIds = recruiters.map(r => r._id)
      jobQuery.$or = [
        { role: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { recruiterId: { $in: recruiterIds } },
      ]
    }

    if (active !== undefined) {
      jobQuery.active = active === 'true'
    }

    const jobs = await Job.find(jobQuery)
      .populate('recruiterId', 'companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const formattedJobs = jobs.map(job => {
      const { recruiterId, createdAt, driveDate, lastDateToApply, ...jobData } =
        job.toObject()

      return {
        ...jobData,
        recruiterName: recruiterId?.companyName || null,
        createdAt: createdAt ? format(new Date(createdAt), 'dd-MMM-yyyy') : '-',
        driveDate: driveDate ? format(new Date(driveDate), 'dd-MMM-yyyy') : '-',
        lastDateToApply: lastDateToApply
          ? format(new Date(lastDateToApply), 'dd-MMM-yyyy')
          : '-',
      }
    })

    const totalElements = await Job.countDocuments(jobQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedJobs,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: jobs.length === 0,
        unsorted: true,
      },
      numberOfElements: jobs.length,
      first: page === 0,
      empty: jobs.length === 0,
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.getJobsByRecruiterId = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '', active } = req.query
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const userId = user?._id
    const recruiter = await Recruiter.findOne({ userId })

    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Jobs not found' })
    }

    const recruiterId = recruiter._id

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let jobQuery = { recruiterId }

    if (search) {
      jobQuery.$or = [
        { role: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }

    if (active !== undefined) {
      jobQuery.active = active === 'true'
    }

    const jobs = await Job.find(jobQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recruiterId', 'name email')

    const formattedJobs = jobs.map(job => {
      const { recruiterId, createdAt, driveDate, lastDateToApply, ...jobData } =
        job.toObject()

      return {
        ...jobData,
        recruiterName: recruiterId?.name || '',
        recruiterEmail: recruiterId?.email || '',
        createdAt: createdAt ? format(new Date(createdAt), 'dd-MMM-yyyy') : '-',
        driveDate: driveDate ? format(new Date(driveDate), 'dd-MMM-yyyy') : '-',
        lastDateToApply: lastDateToApply
          ? format(new Date(lastDateToApply), 'dd-MMM-yyyy')
          : '-',
      }
    })

    const totalElements = await Job.countDocuments(jobQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedJobs,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: jobs.length === 0,
        unsorted: true,
      },
      numberOfElements: jobs.length,
      first: page === 0,
      empty: jobs.length === 0,
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const recruiterId = user._id

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    await Job.findByIdAndDelete(jobId)

    res.status(200).json({ success: true, message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const studentId = user?._id

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      })
    }

    if (job.applicants.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      })
    }

    if (!job.active) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer active and cannot be applied for.',
      })
    }

    job.applicants.push(studentId)
    await job.save()

    const student = await User.findById(studentId)

    if (student && student.fcmToken) {
      const notification = new Notification({
        title: 'Application Submitted',
        message: `You have successfully applied for the job "${job.role}".`,
        createdBy: job.recruiterId,
        recipientIds: [student._id],
      })

      await notification.save()

      const message = {
        notification: {
          title: 'Application Submitted',
          body: `You have successfully applied for the job "${job.role}".`,
        },
        token: student.fcmToken,
      }

      await admin.messaging().send(message)
    }

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
    })
  } catch (error) {
    console.error('Error applying for job:', error)

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}

exports.getAppliedJobs = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const studentId = user._id

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    let jobQuery = { applicants: studentId }

    if (search) {
      jobQuery.$or = [
        { role: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }

    const jobs = await Job.find(jobQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recruiterId', 'companyName')

    const formattedJobs = jobs.map(job => {
      const { recruiterId, createdAt, driveDate, lastDateToApply, ...jobData } =
        job.toObject()

      return {
        ...jobData,
        recruiterName: recruiterId?.companyName || '',
        createdAt: createdAt ? format(new Date(createdAt), 'dd-MMM-yyyy') : '-',
        driveDate: driveDate ? format(new Date(driveDate), 'dd-MMM-yyyy') : '-',
        lastDateToApply: lastDateToApply
          ? format(new Date(lastDateToApply), 'dd-MMM-yyyy')
          : '-',
      }
    })

    const totalElements = await Job.countDocuments(jobQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedJobs,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: jobs.length === 0,
        unsorted: true,
      },
      numberOfElements: jobs.length,
      first: page === 0,
      empty: jobs.length === 0,
    })
  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
exports.withdrawApplication = async (req, res) => {
  try {
    const { jobId } = req.params
    const firebaseUid = req.user.user_id

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const studentId = user._id

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    if (!job.applicants.includes(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: 'You have not applied for this job' })
    }

    job.applicants = job.applicants.filter(
      id => id.toString() !== studentId.toString(),
    )
    await job.save()

    const notification = new Notification({
      title: 'Application Withdrawn',
      message: `You have successfully withdrawn your application for "${job.role}".`,
      createdBy: job.recruiterId,
      recipientIds: [studentId],
    })

    await notification.save()

    if (user.fcmToken) {
      const message = {
        notification: {
          title: 'Application Withdrawn',
          body: `You have successfully withdrawn your application for "${job.role}".`,
        },
        token: user.fcmToken,
      }

      await admin.messaging().send(message)
    }

    res.status(200).json({
      success: true,
      message: 'You have successfully withdrawn your application',
    })
  } catch (error) {
    console.error('Error withdrawing application:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.getJobOpeningById = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId).populate('recruiterId')
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    res.status(200).json({ success: true, job })
  } catch (error) {
    console.error('Error fetching job by ID:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.getJobApplicantsById = async (req, res) => {
  const { jobId } = req.params
  let { page = 0, size = 10, search = '' } = req.query

  try {
    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    const applicantIds = job.applicants.map(app => app._id)

    const searchFilter = search
      ? {
          _id: { $in: applicantIds },
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
          ],
        }
      : { _id: { $in: applicantIds } }

    const totalApplicantsCount = await User.countDocuments(searchFilter)

    const applicants = await User.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .select('name email createdAt')

    const totalPages = size === 0 ? 1 : Math.ceil(totalApplicantsCount / size)

    res.status(200).json({
      jobId: job._id,
      role: job.role,
      content: applicants.map(applicant => ({
        ...applicant.toObject(),
        appliedAt: format(new Date(applicant.createdAt), 'dd-MMM-yyyy'),
      })),
      totalElements: totalApplicantsCount,
      totalPages,
      size,
      number: page,
      numberOfElements: applicants.length,
      first: page === 0,
      last: page + 1 >= totalPages,
      empty: applicants.length === 0,
    })
  } catch (err) {
    console.error('Error fetching applicants:', err)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
