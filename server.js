const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(3000,(req,res)=>{
    console.log(`Server started at port ${PORT}`)
})