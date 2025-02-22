const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Invalid email format'],
  },
  position: { type: String, default: 'TPO', enum: ['TPO', 'Assistant TPO'] },
  profilePhoto: { type: String },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, 'Mobile number must be 12 digits'],
  },
  collegeName: { type: String, required: true, maxlength: 150 },
  collegeAddress: { type: String, required: true, maxlength: 255 },
  collegeWebsite: {
    type: String,
    required: true,
    match: [
      /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d@:%_+.~#?&//=]*)?$/,
      'Invalid URL',
    ],
  },
})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
