const cron = require('node-cron')
const Job = require('../models/Job')

const scheduleJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await Job.updateMany(
        { driveDate: { $lt: new Date() }, active: true },
        { active: false },
      )
      console.log('Deactivated expired jobs.')
    } catch (error) {
      console.error('Error deactivating jobs:', error)
    }
  })

  console.log('Cron job scheduled.')
}

module.exports = scheduleJobs
