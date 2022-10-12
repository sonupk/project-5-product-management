const validator = require("../validations/validator")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")

//=============================== cart creation ==============================================
 const createCart = async function(req,res){
     try {

     }
     catch (error) {
         return res.status(500).send({ status: false, message: error.message })
     }
 }


//=================================== get cart details =======================================

const getCart = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//================================== updating the cart ========================================

const updateCart = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





//======================================= deleting cart ===================================================

const deleteCart = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}






module.exports = { createCart, getCart, updateCart, deleteCart }