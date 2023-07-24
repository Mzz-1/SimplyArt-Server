const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name must be provided"],
        },
        artist: {
            type: String,
            // required: [true, "Artist Name must be provided"],
        },
        category: {
            type: String,
            required: [true, "Category must be provided"],
        },
        description: {
            type: String,
            required: [true, "Dimentions must be provided"],
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
            required: [true, "Price must be provided"],
        },
        dimensions: {
            type: String,
            required: [true, "Dimentions must be provided"],
        },
        url: {
            type: String,
            required: [true, "Image must be provided"],
        },
        uploadedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
