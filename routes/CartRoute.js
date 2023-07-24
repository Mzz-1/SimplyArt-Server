const Cart = require("../models/Cart");
const Product = require("../models/Products");

const addToCart = {
    path: "/api/add-to-cart",
    method: "post",
    handler: async (req, res) => {
        const { userID, productID } = req.body;
        try {
            // Check if the cart already exists for the user
            let cart = await Cart.findOne({ userID: userID });

            // If the cart doesn't exist, create a new cart
            if (!cart) {
                cart = new Cart({ userID: userID });
                await cart.save();
            }

            // Make sure that the cart.items array is defined before calling "find"
            if (!cart.items) {
                cart.items = [];
            }

            // Check if the product is already in the cart
            const productExists = cart.items.find(
                (item) => item.productID.toString() === productID.toString()
            );

            let product = await Product.findOne({ _id: productID });

            // If the product is already in the cart, increase the quantity
            if (productExists) {
                productExists.quantity += 1;
            } else {
                // Otherwise, add the product to the cart
                cart.items.push({ productID: productID, quantity: 1 });
            }

            await cart.save();
            res.status(200).json({
              product
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error adding product to cart" });
        }
    },
};

const deleteCart = {
    path: "/api/delete-cart/:id",
    method: "delete",
    handler: async (req, res) => {
        const { id:userID } = req.params;
        try {
            // Check if the cart already exists for the user
            let cart = await Cart.findOneAndDelete({ userID: userID });

            
            res.status(200).json({
                message: "Cart Deleted",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error adding product to cart" });
        }
    },
};

const getCartDetails = {
    path: "/api/cart/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: userID } = req.params;

        const cart = await Cart.findOne({ userID: userID });

        if (!cart) {
            return res.sendStatus(400);
        }
        res.status(200).json({ cart });
    },
};

const getCartProductDetails = {
    path: "/api/cartProducts/:userID",
    method: "get",
    handler: async (req, res) => {
        const { userID } = req.params;

        try {
            // Use "populate" to populate the "items.productID" field in the cart
            const cart = await Cart.findOne({ userID: userID }).populate({
                path: "items.productID",
                model: "Product",
            });

            if (!cart) {
                return res.sendStatus(404);
            }

            // Extract the product field from the cart document
            const products = cart.items.map((item) => item.productID);

            // Return the products array in the response
            res.status(200).json({ products });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    },
};

const deleteCartProduct = {
    path: "/api/remove-from-cart/:userID/:productID",
    method: "get",
    handler: async (req, res) => {
        const { userID, productID } = req.params;
        console.log(userID, productID);
        try {
            // Find the cart document for the given userID
            const cart = await Cart.findOne({ userID: userID });

            // If the cart doesn't exist, send an error response
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            // Check if the product exists in the cart
            const productIndex = cart.items.findIndex(
                (item) => item.productID.toString() === productID.toString()
            );
            console.log(productIndex);
            // If the product is not found in the cart, send an error response
            if (productIndex === -1) {
                return res
                    .status(404)
                    .json({ message: "Product not found in cart" });
            }

            // Remove the product from the cart by splicing the array
            cart.items.splice(productIndex, 1);

            // Save the updated cart to the database
            await cart.save();

            // Send a success response with a message indicating that the product has been removed from the cart
            res.status(200).json({
                message: "Product removed from cart successfully",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error removing product from cart",
            });
        }
    },
};
module.exports = {
    addToCart,
    getCartDetails,
    getCartProductDetails,
    deleteCartProduct,
    deleteCart
};
