const mongoose = require('mongoose')

const whatsappSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      minlength: 1,
    },
    phoneNumberId: {
      type: String,
      required: true,
      minlength: 1,
    },
    whatsappBusinessID: {
      type: String,
      required: true,
      minlength: 1,
    },
  },
  { timestamps: true },
)

const WhatsApp = mongoose.model('WhatsApp', whatsappSchema)
module.exports = WhatsApp
