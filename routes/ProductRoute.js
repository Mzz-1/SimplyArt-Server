require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const connectCloudinary = require("../db/Cloudinary");
const jwt = require("jsonwebtoken");
const Product = require("../models/Products");
const multer = require("multer");

const upload = multer({ dest: null });

const getAllProducts = {
    path: "/api/products",
    method: "get",
    handler: async (req, res) => {
        const { artist, name, category, sort } = req.query;

        let query = {};
        if (artist) {
            query.artist = artist;
        }
        if (name) {
            query.name = new RegExp(name, "i");
        }
        if (category) {
            query.category = category;
        }
        let result = Product.find(query);

        if (sort) {
            switch (sort) {
                case "A-Z":
                    result = result.sort({ name: 1 });
                    console.log("a-z");
                    break;
                case "Z-A":
                    result = result.sort({ name: -1 });
                    break;
                case "Price:Low to High":
                    result = result.sort({ price: 1 });
                    break;
                case "Price:High to Low":
                    result = result.sort({ price: -1 });
                    break;
                case "Oldest to Newest":
                    result = result.sort({ uploadedAt: 1 });
                    break;
                case "Newest to oldest":
                    result = result.sort({ uploadedAt: -1 });
                    break;
                default:
                    break;
            }
        }

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 12;

        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        const product = await result;

        res.status(200).json({ product });
    },
};

const getProduct = {
    path: "/api/products/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: productID } = req.params;
        const product = await Product.findOne({ _id: productID });
        if (!product) {
            return res.sendStatus(400);
        }
        res.status(200).json({ product });
    },
};

const addProducts = {
    path: "/api/products",
    method: "post",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
            try {
                const {
                    name,
                    artist,
                    category,
                    description,
                    quantity,
                    dimensions,
                    price,
                } = req.body;
                const file = req.file;

                if (!file) {
                    return res
                        .status(400)
                        .json({ message: "No file was uploaded" });
                }

                connectCloudinary();

                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });

                const product = await Product.create({
                    name,
                    artist,
                    category,
                    description,
                    url: result.secure_url,

                    quantity,
                    price,
                    dimensions,
                });

                return res
                    .status(200)
                    .json({ message: "Product created successfully", product });
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .json({ message: "Something went wrong" });
            }
        },
    ],
};

const updateProducts = {
    path: "/api/products/:id",
    method: "patch",
    handler: [
        upload.single("image", { dest: null }),
        async (req, res) => {
        const { id: productID } = req.params;
        const {
            name,
            artist,
            category,
            description,
            quantity,
            dimensions,
            price,
        } = req.body;
        console.log(category,description,name,"c")
        console.log(req.body,"cd")
        const product = await Product.findOneAndUpdate(
            { _id: productID },
            req.body,
            {
                new: true,
                runValidators: true,
                useFindAndModify: true,
            }
        );

        if (!product) {
            return res.status(404);
        }

        res.status(200).json({ product });
    },]
};

const deleteProduct = {
    path: "/api/products/:id",
    method: "delete",
    handler: async (req, res) => {
        const { id: productID } = req.params;
        const product = await Product.findOneAndDelete({ _id: productID });
        if (!product) {
            return res.sendStatus(400);
        }
        res.status(200).json({ product });
    },
};

module.exports = {
    addProducts,
    updateProducts,
    getAllProducts,
    getProduct,
    deleteProduct,
};
