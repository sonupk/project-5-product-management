const express = require("express")
const router = express.Router()
const {createUser,loginUser,getUser,updateuser} = require('../controllers/userController')
const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require("../controllers/productController")
const { Authentication, authorisation } = require('../middlewares/auth')

//=================================== user apis ===============================================
router.post("/register",createUser)
router.post('/login', loginUser)
router.get("/user/:userId/profile",Authentication, authorisation, getUser)
router.put("/user/:userId/profile", Authentication, authorisation, updateuser)

//================================== product apis ============================================

router.post("/products",createProduct)
router.get("/products",getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete("/products/:productId", deleteProduct)



//=================================== cart apis ==============================================




//==================================== order apis ==========================================







module.exports = router