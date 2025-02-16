const express = require('express')
const router = express.Router()

const { login } = require('../controller/Auth')
const {
  StudentProfileCompletion, addOrEditStudentProfile
} = require('../controller/StudentProfileCompletion')

router.post('/login', login)

router.get('/student-profile/:firebaseUid', StudentProfileCompletion)
router.post('/student-profile/:firebaseUid', addOrEditStudentProfile)
router.put('/student-profile/:firebaseUid', addOrEditStudentProfile)

module.exports = router
