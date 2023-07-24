require("dotenv").config();
const jwt = require("jsonwebtoken");
const getGoogleUser = require("../Utils/GetGoogleUser");
const updateOrCreateFromOauth = require("../Utils/UpdateOrCreateUserFromOauth");

const googleOauthCallbackRoute = {
    path: "/auth/google/callback",
    method: "get",
    handler: async (req,res) => {
        const  code  = req.query.code;
        const oauthUserInfo = await getGoogleUser({ code });
        const updateUser = await updateOrCreateFromOauth({ oauthUserInfo });
        const { _id: id, isVerified, email,role } = updateUser;
        jwt.sign(
            { id, email, isVerified,role },
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) {
                    console.log(err,"error")
                    return res.sendStatus(500);
                }
                res.redirect(`http://localhost:3000/login?token=${token}`);
            }
        );
    },
};
module.exports = googleOauthCallbackRoute;
