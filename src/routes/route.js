const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')

//=================================== user apis ===============================================

router.post("/register",userController.createUser)
//================================== product apis ============================================





//=================================== cart apis ==============================================




//==================================== order apis ==========================================



module.exports = router