const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
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
  skillsRequired: [{ type: String, required: true }],
  eligibilityCriteria: { type: String, maxlength: 500 },
  postedDate: { type: Date, default: Date.now },
  lastDateToApply: { type: Date, required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
})

const Job = mongoose.model('Job', jobSchema)
module.exports = Job
