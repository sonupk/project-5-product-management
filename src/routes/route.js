const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')

//=================================== user apis ===============================================
router.post('/login', userController.loginUser)

router.post("/register",userController.createUser)
//================================== product apis ============================================





//=================================== cart apis ==============================================




//==================================== order apis ==========================================





router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,message:"Invalid URL"})
})



module.exports = router