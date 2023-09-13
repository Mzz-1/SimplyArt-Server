const User = require("../models/User");
const connectDB = require("../db/Connect");

const updateOrCreateFromOauth = async ({ oauthUserInfo }) => {
    const { id: googleId, verified_email: isVerified, email } = oauthUserInfo;
    await connectDB(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const result = await User.findOneAndUpdate(
            { email: email },
            {
                googleId,
                isVerified,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: true,
            }
        );
        return result;
    } else {
        const result = await User.create({
            username: email,
            email,
            googleId,
            isVerified,
        });
        return result;
    }
};

module.exports = updateOrCreateFromOauth;
