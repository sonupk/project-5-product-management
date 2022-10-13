const validator = require("../validations/validator")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")

//=============================== cart creation ==============================================
const createCart = async function (req, res) {
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
        let userId = req.params.userId
        let body = req.body
        let { cartId, productId, removeProduct } = body

        //========================================== if body is missing ==============================
        if (!validator.isValidBody(body))
            return res.status(400).send({ status: false, message: "Body cannot be empty" });

        //=========================== only 2 keys should be entered in body ============================
        if (!(cartId || removeProduct || productId)) {
            return res.status(400).send({ status: false, message: "enter valid keys to update order" })
        }

        //====================================== cart exist or not ==================================
        let cartExist = await cartModel.findOne({ userId: userId })
        if (!cartExist) {
            return res.status(404).send({ status: false, message: `No cart found` });
        }

        //======================================== cartId Validation ==================================
        if (cartId) {
            if (!validator.isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
            }
            if (cartExist._id.toString() != body.cartId) {
                return res.status(400).send({ status: false, message: `this cart belong to different user` });
            }
        }

        //==================================== if product  id is present =============================
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Please provide valid product Id" });
        }
        let findProduct = await productModel.findById(body.productId)
        if (!findProduct) {
            return res.status(404).send({ status: false, message: `No product found with this id` });
        }



        let productArr = cartExist.items.filter(x =>
            x.productId.toString() == data.productId) // will return an array 

        if (productArr.length == 0) {
            return res.status(404).send({ status: false, message: "product is not present in the cart" })
        }
        let indexNumber = cartExist.items.indexOf(productArr[0]) // return index no of productArr

        //============================ if removeProduct is present ===================================
        if (removeProduct) {
            if (validator.isValidNumber(removeProduct)) {
                if (!(removeProduct == 0 || removeProduct == 1)) {
                    return res.status(400).send({ status: false, message: "removeProduct can either be 0 or 1" })
                }
                if (removeProduct == 0) {
                    cartExist.totalPrice = (cartExist.totalPrice - (findProduct.price * cartExist.items[indexNumber].quantity)).toFixed(2) //to fixed is used to fix the decimal value to absolute value/or rounded value
                    cartExist.items.splice(indexNumber, 1)
                    cartExist.totalItems = cartExist.items.length
                    cartExist.save()
                }
                if (removeProduct == 1) {
                    cartExist.items[indexNumber].quantity -= 1;
                    cartExist.totalPrice = (cartExist.totalPrice - findProduct.price).toFixed(2)
                    if (cartExist.items[indexNumber].quantity == 0) {
                        cartExist.items.splice(indexNumber, 1)
                    }
                    cartExist.totalItems = cartExist.items.length
                    cartExist.save()
                }
            }
            else {
                return res.status(400).send({ status: false, message: "removeProduct should be number only" })
            }
        }
        return res.status(200).send({ status: true, message: "Successfully updated", data: cartExist })
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