const nodemailer = require('nodemailer')
require('dotenv').config()

exports.sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to,
    subject,
    text,
  })
}
