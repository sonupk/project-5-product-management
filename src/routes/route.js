const express = require("express")
const router = express.Router()
const {createUser,loginUser,getUser,updateuser} = require('../controllers/userController')
const { Authentication, authorisation } = require('../middlewares/auth')

//=================================== user apis ===============================================
router.post("/register",createUser)
router.post('/login', loginUser)
router.get("/user/:userId/profile",Authentication,authorisation,getUser)
router.post("/user/:userId/profile", Authentication,authorisation,updateuser)

//================================== product apis ============================================





//=================================== cart apis ==============================================




//==================================== order apis ==========================================







module.exports = router