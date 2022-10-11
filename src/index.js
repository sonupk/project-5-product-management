const express = require("express")
const app = express()
const route = require("./routes/route")
const mongoose = require("mongoose")
const multer = require("multer")

app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://sonupk:1HivF6DXHWanVcYu@cluster0.vtjazgb.mongodb.net/group43Database",{
     useNewUrlParser: true 
    })
    .then(()=>console.log("MONGO-DB is connected on port 27017"))
    .catch((error)=>console.log(error))



app.use("/",route)



app.use((req, res) => { 
    return res.status(404).send({ status: false, message: "Invalid URL" }); 
})


app.listen(process.env.PORT||3000,()=>{
    console.log(`express app is running on 3000`)
})