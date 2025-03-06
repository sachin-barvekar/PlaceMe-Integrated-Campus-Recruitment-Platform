const express = require('express')
const router = express.Router()
const verifyFirebaseToken = require('../middleware/authMiddleware')

const { login } = require('../controller/auth.controller')
const {
  createPlacement,
  getAllPlacements,
  updatePlacement,
  deletePlacement,
} = require('../controller/placement.controller')
const {
  StudentProfileCompletion,
  addOrEditStudentProfile,
  getAllStudents,
  getStudentQueries,
} = require('../controller/student.controller')
const {
  addOrEditAdminProfile,
  AdminProfileCompletion,
} = require('../controller/admin.controller')
const {
  exchangeToken,
  getBusinessInfo,
  deleteWhatsAppBusinessAccount,
} = require('../controller/whatsapp.controller')
const {
  RecruiterProfileCompletion,
  addOrEditRecruiterProfile,
  getAllRecruiters,
} = require('../controller/recruiter.controller')

const {
  addOrEditJob,
  getJobsByRecruiterId,
  deleteJob,
  getAllJobOpenings,
  applyJob,
  getAppliedJobs,
  withdrawApplication,
} = require('../controller/jobs.controller')
const {
  getUserNotifications,
} = require('../controller/notification.controller')

router.post('/login', login)

router.get('/student-profile', verifyFirebaseToken, StudentProfileCompletion)
router.post('/student-profile', verifyFirebaseToken, addOrEditStudentProfile)
router.put('/student-profile', verifyFirebaseToken, addOrEditStudentProfile)

router.get('/students', verifyFirebaseToken, getAllStudents)
router.get('/student-count', verifyFirebaseToken, getStudentQueries)

router.get('/placements', verifyFirebaseToken, getAllPlacements)
router.post('/placements/create', verifyFirebaseToken, createPlacement)
router.put('/placements/edit/:_id', verifyFirebaseToken, updatePlacement)
router.delete('/placements/delete/:_id', verifyFirebaseToken, deletePlacement)

router.get('/admin-profile', verifyFirebaseToken, AdminProfileCompletion)
router.post('/admin-profile', verifyFirebaseToken, addOrEditAdminProfile)
router.put('/admin-profile', verifyFirebaseToken, addOrEditAdminProfile)

router.post('/whatsapp/exchange_token', verifyFirebaseToken, exchangeToken)
router.get('/whatsapp/business_info', verifyFirebaseToken, getBusinessInfo)
router.delete(
  '/whatsapp/delete-config/:whatsappBusinessID',
  verifyFirebaseToken,
  deleteWhatsAppBusinessAccount,
)

router.get('/recruiters', verifyFirebaseToken, getAllRecruiters)
router.get(
  '/recruiter-profile',
  verifyFirebaseToken,
  RecruiterProfileCompletion,
)
router.post(
  '/recruiter-profile',
  verifyFirebaseToken,
  addOrEditRecruiterProfile,
)
router.put('/recruiter-profile', verifyFirebaseToken, addOrEditRecruiterProfile)

router.get('/job-openings', verifyFirebaseToken, getAllJobOpenings)
router.get('/jobs', verifyFirebaseToken, getJobsByRecruiterId)
router.post('/jobs/create', verifyFirebaseToken, addOrEditJob)
router.put('/jobs/edit/:_id', verifyFirebaseToken, addOrEditJob)
router.delete('/jobs/delete/:jobId', verifyFirebaseToken, deleteJob)
router.patch('/jobs/apply/:jobId', verifyFirebaseToken, applyJob)
router.get('/jobs/applied', verifyFirebaseToken, getAppliedJobs)
router.delete('/jobs/withdraw/:jobId', verifyFirebaseToken, withdrawApplication)

router.get('/notifications', verifyFirebaseToken, getUserNotifications)

module.exports = router
