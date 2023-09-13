require("dotenv").config();
const connectDB = require("../db/Connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { uuid, v4 } = require("uuid");
const sendTEmail = require('../Utils/Email')

const signUpRoute = {
    path: "/api/signup",
    method: "post",
    handler: async (req, res) => {
        const { username, email, password,role } = req.body;
        const db = connectDB(process.env.MONGO_URI); // left
        const user = await User.findOne({ email });

        if (user) {
            return res.sendStatus(409);
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const verificationString = v4();

        const result = await User.create({
            username,
            email,
            passwordHash,
            role,
            isVerified: false,
            verificationString,
        });

        const { insertedId } = result;

        try {
            sendTEmail({
                to: email,
                from: "simply.art213@outlook.com",
                subject: "Please verify your email",
                text: `
                    Thank you for signing up! To verify your email,click here:
                    https://simply-art.vercel.app/verify-email/${verificationString}
                `,
            });

           
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }

        jwt.sign(
            {
                id: insertedId,
                email,
                role,
                isVerified: false,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d",
            },
            (err, token) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).json({ token });
            }
        );
    },
};

module.exports = signUpRoute;
