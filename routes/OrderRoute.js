const Cart = require("../models/Cart");
const Product = require("../models/Products");
const Order = require("../models/Order");
const sendTEmail = require('../Utils/Email')
const User = require("../models/User");

const addOrder = {
    path: "/api/add-order",
    method: "post",
    handler: async (req, res) => {
        const { userId, products, totalAmount } = req.body;

        // Create a new order document
        const order = await Order.create({
          userId,
          products,
          totalAmount,
        });

        const user = await Order.findOne({
          _id:userId
        });
    
        // Save the order to the database
      console.log(products)
      for (const product of products) {
        const { productId, quantity } = product;

        // Find the product in the database
        const productToUpdate = await Product.findOne({_id:productId});

        // Check if the product exists and has sufficient quantity
        if (!productToUpdate || productToUpdate.quantity < quantity) {
          return res.status(400).json({ message: "Invalid product quantity" });
        }

        // Deduct the product quantity
        productToUpdate.quantity -= quantity;

        // Save the updated product to the database
        await productToUpdate.save();
      }
    
        // Clear the user's cart or perform other necessary actions
        // ...

        
    
        res.status(201).json("order");
      
        
    },
};

const getAllOrders = {
    path: "/api/orders",
    method: "get",
    handler: async (req, res) => {
       

        const order = await Order.find();

        if (!order) {
            return res.sendStatus(400);
        }
        res.status(200).json({ order });
    },
};

const getOrder = {
    path: "/api/order/:userId",
    method: "get",
    handler: async (req, res) => {
        const { userId } = req.params;

        const orders = await Order.find({ "userId": userId });
            res.status(200).json({ orders });
        
    },
};

const getArtistOrder = {
  path: "/api/artist-order/:artistName",
  method: "get",
  handler: async (req, res) => {
      const { artistName } = req.params;
      const orders = await Order.find({ "products.artist": artistName });
          res.status(200).json({ orders });
      
  },
};

module.exports = {
    addOrder,
    getAllOrders,
    getOrder,
    getArtistOrder
};
