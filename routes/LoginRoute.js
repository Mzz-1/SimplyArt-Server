require("dotenv").config();
const connectDB = require("../db/Connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const loginRoute = {
    path: "/api/login",
    method: "post",
    handler: async (req, res) => {
        const { email, password } = req.body;

        await connectDB(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendStatus(401);
        }
        if (user.isVerified===false) {
            return res.sendStatus(403);
        }

        const { _id: id, isVerified, passwordHash, role } = user;

        const isCorrect = await bcrypt.compare(password, passwordHash);

        if (isCorrect) {
            jwt.sign(
                {
                    id,
                    isVerified,
                    email,
                    role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2d",
                },
                (err, token) => {
                    if (err) {
                        res.status(500).json(err);
                    }
                    res.status(200).json({ token });
                }
            );
        } else {
            res.sendStatus(401);
        }
    },
};

module.exports = loginRoute;
