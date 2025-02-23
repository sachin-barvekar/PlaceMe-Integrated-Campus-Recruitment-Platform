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

module.exports = router
