const validator= require("../validations/validator");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");


//============================= creating an order ================================================

const createOrder = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





//=================================== updating an order ==========================================

const updateOrder = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createOrder, updateOrder }