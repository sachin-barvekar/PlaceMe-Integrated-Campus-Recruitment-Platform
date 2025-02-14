const express = require('express')
const router = express.Router()

const { login } = require('../controller/Auth')


router.post('/login', login)


module.exports = router
