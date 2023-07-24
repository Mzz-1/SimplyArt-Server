require("dotenv").config();
const { v4 } = require("uuid");
const User = require('../models/User')
const sendTEmail = require("../Utils/Email");

const forgoPasswordRoute={
path:'/api/forgot-password/:email',
method:'put',
handler:async(req,res)=>{
    const {email} = req.params
 
    const passwordResetCode = v4()
 
    const user = await User.findOne({ email });
        if (user) {
         await User.updateOne({email},{
                $set:{passwordResetCode:passwordResetCode}
            })
            await sendTEmail({
                to:email,
                from:'simply.art213@outlook.com',
                subject:"Password Reset",
                text:`
                    To reset your password, click this link:
                    http://localhost:3000/reset-password/${passwordResetCode}
                `
            })
        }

   

    res.sendStatus(200)
}
}

module.exports = forgoPasswordRoute