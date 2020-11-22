const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    userMail : {
        type:String,
        required:true
    },
    pinCode : {
        type:String,
        required:true
    },
    createdAt : {
        type:Date,
        default : Date.now
    },
    updatedAt : {
        type:Date,
        default : Date.now
    },
})

module.exports = mongoose.model('UserCollection',UserSchema)