const express = require('express')
const showRoom = require('../controllers/showRoom')

const router = express.Router()

router.get(
    "/:room",
    showRoom
)

module.exports = router