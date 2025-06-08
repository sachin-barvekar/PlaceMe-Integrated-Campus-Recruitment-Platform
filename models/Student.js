const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, 'Mobile number must be 12 digits'],
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    branch: { type: String, required: true, minlength: 2, maxlength: 50 },
    address: { type: String, maxlength: 255 },
    profilePhoto: { type: String },

    academicDetails: [
      {
        level: {
          type: String,
          enum: ['SSC', 'HSC', 'BE', 'DIPLOMA'],
          required: true,
        },
        institutionName: { type: String, required: true, maxlength: 100 },
        marks: {
          type: Number,
          required: true,
          min: [0, 'Marks must be at least 0'],
          max: [100, 'Marks cannot exceed 100'],
        },
        passingYear: {
          type: Number,
          required: true,
          min: [1950, 'Invalid year'],
          max: [new Date().getFullYear(), 'Invalid year'],
        },
      },
    ],

    skills: { type: [String], default: [] },
    CGPA: {
      type: Number,
      min: [0, 'CGPA must be at least 0'],
      max: [10, 'CGPA cannot exceed 10']
    },
    linkedIn: {
      type: String,
    },
    github: {
      type: String,
    },

    resume: { type: String },
    profileCompletion: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Student = mongoose.model('Student', studentSchema)
module.exports = Student
