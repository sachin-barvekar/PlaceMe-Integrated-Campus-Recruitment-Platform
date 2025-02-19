const express = require('express')
const router = express.Router()

const { login } = require('../controller/Auth')
const {
  StudentProfileCompletion,
  addOrEditStudentProfile,
} = require('../controller/StudentProfileCompletion')
const { getAllStudents } = require('../controller/GetStudents')
const {
  createPlacement,
  getAllPlacements,
} = require('../controller/placement.controller')

router.post('/login', login)

router.get('/student-profile/:firebaseUid', StudentProfileCompletion)
router.post('/student-profile/:firebaseUid', addOrEditStudentProfile)
router.put('/student-profile/:firebaseUid', addOrEditStudentProfile)

router.get('/students', getAllStudents)

router.post('/placements/create', createPlacement)
router.get('/placements', getAllPlacements)

module.exports = router
