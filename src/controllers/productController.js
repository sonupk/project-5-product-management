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
        req.body.title = title.replace(/\s+/g, ' ').toLowerCase()
        //===================================== duplicate title ===========================================
        let duplicateTitle = await productModel.findOne({ title: data.title })
        if (duplicateTitle) return res.status(400).send({ status: false, message: "Title already exist" })

        //==================================== description is mandatory ===============================
        if (!description) return res.status(400).send({ status: false, message: "Description is mandatory" });
        if (!validator.isValid(description)) return res.status(400).send({ status: false, message: "description is in wrong format" });
        req.body.description = description.replace(/\s+/g, ' ').toLowerCase()

        //==================================== price is required =========================================
        if (!price) return res.status(400).send({ status: false, message: "price is Required" });
        if (!(validator.isValidNumber(price))) {
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
            if (typeof isFreeShipping == "string") {
                data.isFreeShipping = isFreeShipping.toLowerCase();
                if (isFreeShipping == 'true' || isFreeShipping == 'false') {
                    isFreeShipping = JSON.parse(isFreeShipping)
                } else {
                    return res.status(400).send({ status: false, message: "Please enter true or false" })
                }
            }
        }

        //============================= productimage validation =============================================
        if (files.length == 0) return res.status(400).send({ status: false, message: "ProductImage is required" });
        let productImgUrl = await uploadFile(files[0]);
        if (!validator.validImage(productImgUrl)) {
            return res.status(400).send({ status: false, msg: "productImage is in incorrect format" })
        }
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

        //========================================= installments validations ===============================
        if (installments) {
            if (!(validator.isValidNumber(installments))) {
                return res.status(400).send({ status: false, message: "installments should be a number" })
            }
        }

        let createProduct = await productModel.create(data);
        return res.status(201).send({ status: true, message: "product created sucessfully", data: createProduct });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//========================================== get product details =======================================

const getProduct = async function (req, res) {
    try {
        let queryData = req.query
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = queryData
        //===========================if no query then filter with isDeleted:false========================
        if (Object.keys(queryData).length == 0) {
            let filterData = await productModel.find({ isDeleted: false })
            return res.status(200).send({ status: true, message: `Found ${filterData.length} Items`, data: filterData })
        }
        let keys = "size, name, priceGreaterThan, priceLessThan, priceSort"

        //============================= if query is present ============================================
        if (size || priceSort || priceLessThan || priceGreaterThan || name) {

            let objectFilter = { isDeleted: false }
            //================================ if size query is present ==========================================
            if (size) {
                let checkSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                let arraySize = size.split(",")
                for (let i = 0; i < arraySize.length; i++) {
                    if (checkSizes.includes(arraySize[i])) {
                        continue;
                    }
                    else {
                        return res.status(400).send({ status: false, message: "Sizes should in this ENUM only S/XS/M/X/L/XXL/XL" })
                    }
                }
                objectFilter["availableSizes"] = { $in: arraySize }
            }
            //==================================== if name query is present ======================================
            if (name) {
                if (!validator.isValid(name)) return res.status(400).send({ status: false, message: "Name should not be empty" })
                name = name.replace(/\s+/g, ' ').trim()
                objectFilter["title"] = { $regex: name, $options: 'i' }
            }
            //=============================== if pricegreaterthen is present =========================
            if (priceGreaterThan) {
                if (!validator.isValid(priceGreaterThan)) return res.status(400).send({ status: false, message: "priceGreaterThan is empty" })
                if (!validator.isValidNumber(priceGreaterThan)) return res.status(400).send({ status: false, message: "You entered invalid priceGreaterThan.please enter number." })
                objectFilter["price"] = { $gt: priceGreaterThan }
            }
            //================================ if pricelessthen is present ====================================
            if (priceLessThan) {
                if (!validator.isValid(priceLessThan)) return res.status(400).send({ status: false, message: "priceLessThan is empty" })
                if (!validator.isValidNumber(priceLessThan)) return res.status(400).send({ status: false, message: "You entered invalid priceLessThan" })
                objectFilter["price"] = { $lt: priceLessThan }

            }
            //================== if both pricegreaterthan and pricelessthan is present ===================
            if (priceGreaterThan && priceLessThan) {
                objectFilter['price'] = { $gt: priceGreaterThan, $lt: priceLessThan }
            }
            //========================= if pricesort query is present ==================================
            if (priceSort) {
                if (validator.isValid(priceSort)) {
                    if (!(priceSort == "1" || priceSort == "-1")) return res.status(400).send({ status: false, message: "You entered an invalid input sorted By can take only two Inputs 1 OR -1" })
                }
            }

            //========================== fetching data using filters =======================================
            let findFilter = await productModel.find(objectFilter).sort({ price: priceSort })
            if (findFilter.length == 0) return res.status(404).send({ status: false, message: "No product Found" })

            return res.status(200).send({ status: true, message: `${findFilter.length} Match Found`, data: findFilter })
        }
        else {
            return res.status(400).send({ status: false, message: `Cannot provide keys other than ${keys}` })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//=========================================== get product by productid ================================

const getProductById = async function (req, res) {
    try {
        let requestBody = req.params.productId
        if (!validator.isValidObjectId(requestBody)) {
            return res.status(400).send({ status: false, message: "productid is of invalid format" })
        }
        //===================================== getting non deleted data =================================
        let productCheck = await productModel.findOne({ _id: requestBody, isDeleted: false })
        if (!productCheck) {
            return res.status(404).send({ status: false, message: "product not found or the product is deleted" })
        }
        res.status(200).send({ status: true, data: productCheck })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//==================================== update product details ====================================

const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        let body = req.body
        const files = req.files
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = body
        const data = {}

        //=============================== invalid format of productid ==============================
        if (!validator.isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'productId is not in valid format' })

        let product = await productModel.findById(productId)
        //========================== product not found ==========================================
        if (!product) return res.status(404).send({ status: false, message: 'product not found' })
        //============================= if product is already deleted ============================
        if (product.isDeleted == true) return res.status(404).send({ status: false, message: `Product is deleted` })

        //========================= if no keys are provided to update data========================
        if (!(title || description || price || currencyId || currencyFormat || isFreeShipping || style || availableSizes || installments || files)) {
            return res.status(400).send({ status: false, message: `please enter valid key in body` })
        }
        //================================= if files is present =======================================
        if (files) {
            let productImgUrl = await uploadFile(files[0]);
            if (!validator.validImage(productImgUrl)) {
                return res.status(400).send({ status: false, msg: "productImage is in incorrect format" })
            }
            data.productImage = productImgUrl;
        }


        //==================================== if title is present ======================================
        if (title) {
            if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "title can not be empty" })
            if (await productModel.findOne({ title: title })) return res.status(400).send({ status: false, message: `This title ${title} is already present please Give another Title` })
            data.title = title
        }

        //================================= if discription is present ==================================
        if (description) {
            if (!validator.isValid(description)) return res.status(400).send({ status: false, message: "description can not be empty" })
            data.description = description
        }

        //================================= if price is present ========================================
        if (price) {
            if (!validator.isValidNumber(price)) return res.status(400).send({ status: false, message: "price should be in valid Format with Numbers || Decimals" })
            data.price = price
        }

        //==================================== if currencyid is present ==============================
        if (currencyId) {
            if (!validator.isValid(currencyId)) return res.status(400).send({ status: false, message: "currencyId can not be empty" })
            if (!/^INR$/.test(currencyId)) return res.status(400).send({ status: false, message: `currencyId Should be in this form 'INR' only` })

            data.currencyId = currencyId
        }

        //================================== if currencyformat is present ==========================
        if (currencyFormat) {
            if (!validator.isValid(currencyFormat)) return res.status(400).send({ status: false, message: "currencyFormat can not be empty" })
            if (!/^₹$/.test(currencyFormat)) return res.status(400).send({ status: false, message: `currencyFormat Should be in this form '₹' only` })

            data.currencyFormat = currencyFormat
        }

        //============================ if isfreeshipping is present ======================================
        if (isFreeShipping) {
            if (!validator.isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "isFreeShipping can not be empty" })
            if (!/^(true|false)$/.test(isFreeShipping)) return res.status(400).send({ status: false, message: `isFreeShipping Should be in boolean with small letters` })
            data.isFreeShipping = isFreeShipping
        }

        //============================== if style is present =============================================
        if (style) {
            if (!validator.isValid(style)) return res.status(400).send({ status: false, message: "style can not be empty" })
            data.style = style
        }

        //====================================== if avalaible sizes is present ==========================
        if (availableSizes) {
            if (!validator.isValid(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes can not be empty" })
            availableSizes = availableSizes.toUpperCase()
            let size = availableSizes.split(',').map(x => x.trim())
            //============================= checking enum validation ===========================
            for (let i = 0; i < size.length; i++) {
                if (!validator.isValidSize(size[i]))
                    return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS'  || 'M' || 'X' || 'L' || 'XXL' || 'XL']` })

            }
            data['$addToSet'] = {}
            data['$addToSet']['availableSizes'] = size

        }

        //=============================== if installments is present =======================================
        if (installments) {
            if (!/^\d+$/.test(installments)) return res.status(400).send({ status: false, message: "installments should have only Number" })

            data.installments = installments
        }

        //=================================== updating product ===========================================
        const newProduct = await productModel.findByIdAndUpdate(productId, data, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: newProduct })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//================================================== delete products ====================================

const deleteProduct = async (req, res) => {
    try {
        let product = req.params.productId
        //=================================== productid validation =================================
        if (!validator.isValidObjectId(product)) {
            return res.status(400).send({ status: false, message: "Please provide valid Product Id" })
        }

        let getId = await productModel.findOne({ _id: product, isDeleted: false });
        if (!getId) {
            return res.status(404).send({ status: false, message: "Product Not Found!!!!!!!!!!!!!! or product may be deleted already" })
        }

        await productModel.updateOne({ _id: product }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "Product is deleted successfully" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

};



module.exports = { createProduct, getProduct, getProductById, updateProduct, deleteProduct }