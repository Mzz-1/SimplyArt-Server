const Delivery = require("../models/Delivery");

const addDelivery = {
    path: "/api/delivery",
    method: "post",
    handler: async (req, res) => {
        const { cartID, district, city, streetName, contactNo } = req.body;

        const delivery = await Delivery.create({
            cartID,
            district,
            city,
            streetName,
            contactNo,
        });
     

        res.status(200).json({delivery});
    },
};

const getDeliveryDetails = {
    path: "/api/delivery/:id",
    method: "get",
    handler: async (req, res) => {
        const { id: deliveryID } = req.params;

        const delivery = await Delivery.findOne({ _id: deliveryID });

        if (!delivery) {
            return res.sendStatus(400);
        }
        res.status(200).json({ delivery });
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
module.exports = {
    addDelivery,
    getDeliveryDetails
};
