const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { uploadFile } = require("../aws/aws")
const validator = require("../validations/validator")

// ====================regex========================
let nameregex = /^[a-zA-Z\. ]*$/
let emailregex = /^[a-z0-9_]{1,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/
let phoneregex = /^[\s]*[6-9]\d{9}[\s]*$/
let passwordregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
let pincoderegex = /^[1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3}/
let streetregex = /A-Za-z0-9'\.\-\s\,/
// ====================regex========================

const createUser = async function (req, res) {
    try {
        let requestBody = req.body;
        let files = req.files
        const { fname, lname, email, password, phone, address } = requestBody //Destructuring

        if (!Object.keys(requestBody).length) return res.status(400).send({ status: false, msg: "Enter some data" })

        // Mandatorys
        if (!fname) return res.status(400).send({ status: false, msg: "fname is mandatory" })
        if (!lname) return res.status(400).send({ status: false, msg: "lname is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        if (files.length == 0) return res.status(400).send({ status: false, msg: "profileImage is mandatory" })
        if (!password) return res.status(400).send({ status: false, msg: "password is mandatory" })
        if (!phone) return res.status(400).send({ status: false, msg: "phone is mandatory" })
        if (!address) return res.status(400).send({ status: false, msg: "address is mandatory" })

        // validations
        if (!fname.match(nameregex)) return res.status(400).send({ status: false, msg: "name is not valid" })
        if (!lname.match(nameregex)) return res.status(400).send({ status: false, msg: "name is not valid" })
        if (!email.match(emailregex)) return res.status(400).send({ status: false, message: "Email is invalid" })
        if (!phone.match(phoneregex)) return res.status(400).send({ status: false, msg: "phone number is invalid , it should be starting with 6-9 and having 10 digits" })
        if (!password.match(passwordregex)) return res.status(400).send({ status: false, message: "password is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character and one number & one uppercase letter" })

        let phoneCheck = await userModel.findOne({ phone: phone })
        if (phoneCheck) return res.status(409).send({ status: false, msg: "phone number is already used" })
        let emailCheck = await userModel.findOne({ email: email })
        if (emailCheck) return res.status(409).send({ status: false, msg: "email is already used " })
        
        // if (address && typeof address != "object") {
        //     return res.status(400).send({ status: false, message: "Address is in wrong format" })
        // };
        if (address) {
        
            if (address.shipping) {
                if (typeof address.shipping != "object") {
                    return res.status(400).send({ status: false, message: "Shipping Address is in wrong format" })
                }
                // Mandatorys
                if (!address.shipping.street) return res.status(400).send({ status: false, msg: "street is mandatory in Shipping" })
                if (!address.shipping.city) return res.status(400).send({ status: false, msg: "city is mandatory in Shipping" })
                if (!address.shipping.pincode) return res.status(400).send({ status: false, msg: "pincode is mandatory in Shipping" })
                // validations
                if (!address.shipping.street.match(streetregex)) return res.status(400).send({ status: false, message: "street is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character and one number & one uppercase letter" })
                if (!address.shipping.city.match(nameregex)) return res.status(400).send({ status: false, msg: "city name is not valid" })
                if (!address.shipping.pincode.match(pincoderegex)) return res.status(400).send({ status: false, msg: "Pincode is not valid" })
            }
            if (address.billing) {
                if (typeof address.billing != "object") {
                    return res.status(400).send({ status: false, message: "Shipping Address is in wrong format" })
                }
                // Mandatorys
                if (!address.billing.street) return res.status(400).send({ status: false, msg: "street is mandatory in Shinpping" })
                if (!address.billing.city) return res.status(400).send({ status: false, msg: "city is mandatory in Shinpping" })
                if (!address.billing.pincode) return res.status(400).send({ status: false, msg: "pincode is mandatory in Shinpping" })
                // validations
                if (!address.billing.street.match(streetregex)) return res.status(400).send({ status: false, message: "street is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character and one number & one uppercase letter" })
                if (!address.billing.city.match(nameregex)) return res.status(400).send({ status: false, msg: " city name is not valid" })
                if (!address.billing.pincode.match(pincoderegex)) return res.status(400).send({ status: false, msg: "Pincode is not valid" })
            }
        }
        //bcrypt
        requestBody.address = JSON.parse(requestBody.address)
        requestBody.password = await bcrypt.hash(password, 10)
        //S3
        let Image = await uploadFile(files[0])
        requestBody.profileImage = Image


        let created = await userModel.create(requestBody)
        res.status(201).send({ status: true, msg: "User successfully created", data: created })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//================================= getting userdetails ===================================================
const getUser = async function (req, res) {
    try {
        let userId = req.params.userId;
        const user = await userModel.findOne({ _id: userId })
        return res.status(200).send({ status: true, message: 'User Details', data: user })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {
    try {
        let loginData = req.body
        let { email, password } = loginData

        //validation
        if (!validator.isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please fill email or password" })

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory email ` })
        }
        if (!password)
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory password ` })


        let user = await userModel.findOne({ email: email });
        if (!user) {
            
            return res.status(404).send({ status: false, message: "Email Not found" });
            
        }
        //comparing hard-coded password to the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "wrong password" })
        }

        let exp = (60 * 60 * 60 * 1000)
        //token credentials
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: exp
            },
            "project/booksManagementGroup43"// => secret key
        );

        //   res.status(200).setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "login successfully", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, loginUser ,getUser}


