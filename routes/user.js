const express = require('express')
const router = express.Router()
const verifyFirebaseToken = require('../middleware/authMiddleware')

const { login } = require('../controller/auth.controller')
const {
  createPlacement,
  getAllPlacements,
} = require('../controller/placement.controller')
const {
  StudentProfileCompletion,
  addOrEditStudentProfile,
  getAllStudents,
} = require('../controller/student.controller')

router.post('/login', verifyFirebaseToken, login)

router.get(
  '/student-profile/:firebaseUid',
  verifyFirebaseToken,
  StudentProfileCompletion,
)
router.post(
  '/student-profile/:firebaseUid',
  verifyFirebaseToken,
  addOrEditStudentProfile,
)
router.put(
  '/student-profile/:firebaseUid',
  verifyFirebaseToken,
  addOrEditStudentProfile,
)

router.get('/students', verifyFirebaseToken, getAllStudents)

router.get('/placements', verifyFirebaseToken, getAllPlacements)
router.post('/placements/create', verifyFirebaseToken, createPlacement)

module.exports = router
