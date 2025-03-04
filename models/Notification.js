const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Notification', notificationSchema)
