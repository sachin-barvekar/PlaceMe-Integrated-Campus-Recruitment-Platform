const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true,
    },
    role: { type: String, required: true, maxlength: 100 },
    jobDescription: { type: String, required: true, maxlength: 2000 },
    location: { type: String, required: true, maxlength: 100 },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Internship'],
      required: true,
    },
    package: { type: String, maxlength: 50 },
    skillsRequired: { type: String, required: true },
    eligibilityCriteria: { type: String, maxlength: 500 },
    lastDateToApply: { type: Date, required: true },
    driveDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  },
  { timestamps: true },
)

const Job = mongoose.model('Job', jobSchema)
module.exports = Job
