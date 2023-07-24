const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const deliverySchema = mongoose.Schema({
    city: {
        type: String,
        required: [true, "City must be provided"],
    },
    streetName: {
        type: String,
        required: [true, "Street Name must must be provided"],
    },
    district: {
        type: String,
        required: [true, "District must be provided"],
    },
    contactNo: {
        type: String,
        required: [true, "Contact Number must be provided"],
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
});

module.exports = mongoose.model("Delivery", deliverySchema);
