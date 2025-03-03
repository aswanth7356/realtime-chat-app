const express = require('express')
const authController = require('../controllers/auth.controller')
const { protectRoute } = require('../middleware/auth.middleware')


const router = express.Router()


router.post("/signup",authController.signup)
router.post("/login",authController.login)
router.post("/logout",authController.logout)


router.put('/update-profile',protectRoute,authController.updateProfile)
router.get('/check',protectRoute,authController.checkAuth)


module.exports = router