const mongoose = require("mongoose");
function dbConnect(){
    return mongoose.connect("mongodb://localhost:27017/blogapp").then(()=>{
        console.log("mongodb connected successful")
    })
}
module.exports = dbConnect;