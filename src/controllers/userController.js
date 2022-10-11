const userModel = require("../models/userModel")
const aws = require("../aws/aws")
const jwt = require ("jsonwebtoken")
const bcrypt = require ("bcrypt")

const loginUser = async function (req, res) {
    try {
        let loginData = req.body
        let { email, password } = loginData

        //validation
        if (!validator.isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please fill email or password" })
        
        if (!validator.isValidEmail(email) || !validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: `Please fill valid or mandatory email and password` })
        }

        let user = await userModel.findOne({ email: email });
        if (!user) {

            return res.status(404).send({ status: false, message: "Email Not found" });
       
        }
        //comparing hard-coded password to the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "wrong password" })
        }
        

        let iat = Date.now()
        let exp = (iat) + (60 * 60 * 60 * 1000)
        //token credentials
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                iat: iat,
                exp: exp
            },
            "project/productsManagementGroup43"// => secret key
        );

        //   res.status(200).setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "Success", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports={loginUser}

