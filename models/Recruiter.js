const mongoose = require('mongoose')

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: { type: String, required: true, maxlength: 100 },
    aboutUs: { type: String, maxlength: 1000 },
    companyWebsite: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d@:%_+.~#?&//=]*)?$/,
        'Invalid URL',
      ],
    },
    linkedIn: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
        'Invalid LinkedIn URL',
      ],
    },
    profilePhoto: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d@:%_+.~#?&//=]*)?$/,
        'Invalid URL',
      ],
    },
    address: { type: String, required: true, maxlength: 255 },
  },
  { timestamps: true },
)

const Recruiter = mongoose.model('Recruiter', recruiterSchema)
module.exports = Recruiter
