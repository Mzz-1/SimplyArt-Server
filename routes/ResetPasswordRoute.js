require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const connectDB = require("../db/Connect");

const resetPasswordRoute = {
    path: "/api/users/:passwordResetCode/reset-password",
    method: "put",
    handler: async (req, res) => {
        const { passwordResetCode } = req.params;
        const { newPassword } = req.body;

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        await connectDB(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { passwordResetCode },
            {
                $set: { passwordHash: newPasswordHash },
                $unset: { passwordResetCode: "" },
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        if (!user) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    },
};

module.exports = resetPasswordRoute;
