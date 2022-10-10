const express = require("express")
const app = express()
const route = require("./routes/route")
const mongoose = require("mongoose")
const multer = require("multer")
require("dotenv").config()


app.use(express.json())
app.use(multer().any())

mongoose.connect(process.env.MONGO_DBstring,{
     useNewUrlParser: true 
    })
    .then(()=>console.log("MONGO-DB is connected on port 27017"))
    .catch((error)=>console.log(error))

app.use("/",route)

app.use((req, res) => { 
    res.status(404).send({ status: 'Error', message: "The Path you are requesting is not available !!" }); 
})

app.listen(process.env.PORT,()=>{
    console.log(`express app is running on ${process.env.PORT}`)
})