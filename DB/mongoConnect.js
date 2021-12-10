const mongoose=require("mongoose")
require('dotenv').config()
const uri=process.env.MONGODB_URL
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
mongoose.connection.once("open", ()=>{
    console.log("Connection Established sucessfully")
    
})

module.exports=mongoose