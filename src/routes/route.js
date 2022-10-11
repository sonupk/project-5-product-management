const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const { Authentication, authorisation } = require('../middlewares/auth')

//=================================== user apis ===============================================

router.post("/register",userController.createUser)
router.get("/user/:userId/profile",Authentication,authorisation,userController.getUser)
//================================== product apis ============================================





//=================================== cart apis ==============================================




//==================================== order apis ==========================================



module.exports = router