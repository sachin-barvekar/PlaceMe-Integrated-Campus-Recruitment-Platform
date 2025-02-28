const Job = require('../models/Job')
const User = require('../models/User')
const { format } = require('date-fns')

exports.addOrEditJob = async (req, res) => {
  try {
    const firebaseUid = req.user.user_id
    const user = await User.findOne({ firebaseUid })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const recruiterId = user?._id
    const jobData = req.body

    let job
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
    }

    await job.save()

    return res.status(200).json({
      success: true,
      message: jobData.jobId
        ? 'Job updated successfully'
        : 'Job created successfully',
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

exports.getJobsByRecruiterId = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '', active } = req.query
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

    if (job.recruiterId.toString() !== recruiterId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized to delete this job' })
    }

    await Job.findByIdAndDelete(jobId)

    res.status(200).json({ success: true, message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
