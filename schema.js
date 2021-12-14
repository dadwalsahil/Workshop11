const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    filename:String,
    imagepath : String,
    imageextension :String,
    imageSize:Number
    
})

var employeeModel = mongoose.model('images',userSchema);
module.exports=employeeModel;