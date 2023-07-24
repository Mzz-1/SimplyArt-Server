const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const userSchema = mongoose.Schema({
    username:{
        type: String,
     
        unique: true,
        trim:true,
    },
    googleID:{
        type: String,
        unique: true,
        trim:true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        
    },
    passwordHash: {
        type: String,
       
        
    },
    receiveEmail:{
        type:Boolean,
    },
    isVerified: {
        type: Boolean,
    },
    verificationString: {
        type: String,
    },
    passwordResetCode: {
        type: String,
    },
    role:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = mongoose.model("User", userSchema);
