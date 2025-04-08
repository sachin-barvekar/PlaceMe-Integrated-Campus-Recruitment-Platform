const mongoose = require('mongoose')

const placementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    companyName: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, 'Company name must not exceed 100 characters'],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: false,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [100, 'Job role must not exceed 100 characters'],
    },
    package: {
      type: String,
      required: [true, 'Package is required'],
      trim: true,
      maxlength: [20, 'Package must not exceed 20 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location must not exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['Placed', 'Pending', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true },
)

placementSchema.pre('save', async function (next) {
  const User = mongoose.model('User')

  try {
    const student = await User.findById(this.studentId)
    if (!student || student.role !== 'student') {
      return next(new Error("Invalid studentId: User must have role 'student'"))
    }
    if (this.companyId) {
      const company = await User.findById(this.companyId)
      if (!company || company.role !== 'recruiter') {
        return next(
          new Error("Invalid companyId: User must have role 'recruiter'"),
        )
      }
    }
    if (!this.companyId && !this.companyName) {
      return next(new Error('Either companyId or companyName is required'))
    }
    if (this.companyId && this.companyName) {
      return next(
        new Error('Provide either companyId or companyName, not both'),
      )
    }

    next()
  } catch (err) {
    next(err)
  }
})

const Placement = mongoose.model('Placement', placementSchema)
module.exports = Placement
