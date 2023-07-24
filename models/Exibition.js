const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const artistSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim:true,
    },
    biography:{
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim:true,
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
    },
    instagram: {
        type: String,
    },
    linkedin:{
        type:String,
    },
    exibition:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },

});

module.exports = mongoose.model("Exhibition", exhitioSchema);
