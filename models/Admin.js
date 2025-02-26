const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    position: {
      type: String,
      default: 'TPO',
      enum: ['TPO', 'Assistant TPO', 'FACULTY'],
    },
    profilePhoto: { type: String },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, 'Mobile number must be 12 digits'],
    },
    collegeName: { type: String, required: true, maxlength: 150 },
    collegeAddress: { type: String, required: true, maxlength: 255 },
    linkedIn: {
      type: String,
    },
    profileCompletion: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
