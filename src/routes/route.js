const express = require("express")
const router = express.Router()
const {createUser,loginUser,getUser,updateUser} = require('../controllers/userController')
const {createProduct,getProduct,getProductById,updateProduct,deleteProduct} = require("../controllers/productController")
const { createCart, getCart ,updateCart,deleteCart} = require("../controllers/cartController")
const {createOrder , updateOrder} = require("../controllers/orderController")
const { Authentication, authorization } = require('../middlewares/auth')

//=================================== user apis ===============================================
router.post("/register",createUser)
router.post('/login', loginUser)
router.get("/user/:userId/profile",Authentication, authorization, getUser)
router.put("/user/:userId/profile", Authentication, authorization, updateUser)

//================================== product apis ============================================

router.post("/products",createProduct)
router.get("/products",getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProduct)
router.delete("/products/:productId", deleteProduct)

//=================================== cart apis ==============================================

router.post("/users/:userId/cart", Authentication, authorization, createCart)
router.get("/users/:userId/cart", Authentication, authorization, getCart)
router.put('/users/:userId/cart', Authentication, authorization, updateCart)
router.delete('/users/:userId/cart', Authentication, authorization, deleteCart)

//==================================== order apis ==========================================

router.post("/users/:userId/orders", Authentication, authorization, createOrder)
router.put("/users/:userId/orders", Authentication,authorization, updateOrder)






module.exports = router