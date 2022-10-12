const productModel = require('../models/productModel');
const validator = require("../validations/validator");
const { uploadFile } = require('../aws/aws');


//================================================ creating product ==============================================

const createProduct = async function (req, res) {
    try {
        let data = req.body;
        let files = req.files;

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data;

        //================================== if body is empty ==============================================
        if (!validator.isValidBody(data)) return res.status(400).send({ status: false, message: "Please provide data in body" });

        //=================================== title validation ================================================
        if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" });
        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "Title is in wrong format" });
        req.body.title = title.replace(/\s+/g, ' ')
        //===================================== duplicate title ===========================================
        let duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) return res.status(400).send({ status: false, message: "Title already exist" })

        //==================================== description is mandatory ===============================
        if (!description) return res.status(400).send({ status: false, message: "Description is mandatory" });
        if (!validator.isValid(description)) return res.status(400).send({ status: false, message: "description is in wrong format" });
        req.body.description = description.replace(/\s+/g, ' ')

        //==================================== price is required =========================================
        if (!price) return res.status(400).send({ status: false, message: "price is Required" });
        if ((typeof price !== "number")) {
            return res.status(400).send({ status: false, message: "price should be a number" })
        }

        //===================================== currency id validation ================================
        if (currencyId) {
            if (!validator.isValid(currencyId)) return res.status(400).send({ status: false, message: " currencyId should not be an empty string" });

            if (!(/INR/.test(currencyId))) return res.status(400).send({ status: false, message: " currencyId should be in 'INR' Format" });
        } else {
            data.currencyId = "INR"
        }

        //=================================== currencyformat validation ================================
        if (currencyFormat) {
            if (!validator.isValid(currencyFormat)) return res.status(400).send({ status: false, message: "Currency format of product should not be empty" });

            if (!(/₹/.test(currencyFormat))) return res.status(400).send({ status: false, message: "Currency format of product should be in '₹' " });
        } else {
            data.currencyFormat = "₹"
        }

        //=================================== isfreeshipping validation ===================================
        if (isFreeShipping) {
            if(typeof isFreeShipping !== "boolean"){
                return res.status(400).send({ status: false, message: "Please enter true or false" })
            }
                data.isFreeShipping = isFreeShipping.toLowerCase();
                 
        }

        //============================= productimage validation =============================================
        if (files.length == 0) return res.status(400).send({ status: false, message: "ProductImage is required" });
        let productImgUrl = await uploadFile(files[0]);
        data.productImage = productImgUrl;

        //=============================== style validation ===================================================
        if (style) {
            if (!validator.isValid(style)) return res.status(400).send({ status: false, message: "Style should be valid an does not contain numbers" });
        }
        
        //================================ availablesizes validation ==========================================
        if (!availableSizes) return res.status(400).send({ status: false, message: " availableSizes is Required" });
        if (availableSizes) {
            let size = availableSizes.toUpperCase().split(",") 
            data.availableSizes = size;
            for (let i = 0; i < data.availableSizes.length; i++) {
                if (!validator.isValidSize(data.availableSizes[i])) {
                    return res.status(400).send({ status: false, message: "Size should be one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'" });
                }
            }
        }

        //========================================= installments validations =========================================
        if (installments) {
            if ((typeof installments !== "number")) {
                return res.status(400).send({ status: false, message: "installments should be a number" })
            }
        }

        let createProduct = await productModel.create(data);
        return res.status(201).send({ status: true, message: "product created sucessfully", data: createProduct });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//========================================== get product details =========================================================

const getProduct = async function(req,res){
    try{

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message })
    }
}

//=========================================== get product by productid ==================================================
const getProductById = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//============================================= update product details ===================================================

const updateProduct = async function (req, res) {
    try {

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//================================================== delete products ======================================================

const deleteProduct = async (req, res) => {
    try {
        let product = req.params.productId
        //=================================== prodcutid validation ======================================================
        if (!validator.isValidObjectId(product)) { res.status(400).send({ status: false, message: "Please provide valid Product Id" }) }
        let getId = await productModel.findOne({ _id: product });
        if (!getId) {
            { return res.status(404).send({ status: false, message: "Product Not Found!!!!!!!!!!!!!!" }) }
        }
        if (getId.isDeleted == true) {
            { return res.status(404).send({ status: false, message: "Product is already deleted." }) }
        }
        await productModel.updateOne({ _id: product }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "Product is deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

};

module.exports = { createProduct , getProduct ,getProductById,updateProduct, deleteProduct}