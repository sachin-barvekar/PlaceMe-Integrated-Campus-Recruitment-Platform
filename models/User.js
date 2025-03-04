const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'student', 'recruiter'],
    },
    firebaseUid: {
      type: String,
      required: true,
    },
    fcmToken: {
      type: String,
    },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)
module.exports = User
