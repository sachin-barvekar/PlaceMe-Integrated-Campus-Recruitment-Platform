const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, 'Mobile number must be 12 digits'],
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date, required: true },
  branch: { type: String, required: true },
  address: { type: String },
  profilePhoto: { type: String },

  academicDetails: [
    {
      level: {
        type: String,
        enum: ['SSC', 'HSC', 'BE', 'DIPLOMA'],
        required: true,
      },
      institutionName: { type: String, required: true },
      marks: { type: Number, required: true },
      passingYear: { type: Number, required: true },
    },
  ],

  skills: { type: String, required: true },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  profileCompletion: { type: Boolean, default: false },
})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student
