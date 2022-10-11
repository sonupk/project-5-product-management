const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const { Authentication, authorisation } = require('../middlewares/auth')

//=================================== user apis ===============================================
router.post('/login', userController.loginUser)
router.post("/register",userController.createUser)
router.get("/user/:userId/profile",Authentication,authorisation,userController.getUser)
//================================== product apis ============================================





//=================================== cart apis ==============================================




//==================================== order apis ==========================================





router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,message:"Invalid URL"})
})



module.exports = router