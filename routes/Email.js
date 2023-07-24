require("dotenv").config();
const email = require("sib-api-v3-sdk");
const client = email.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const testEmailRoute = {
    path: "/api/test-email",
    method: "post",
    handler: async (req, res) => {
        let mail = new email.TransactionalEmailsApi();
        try {
            await mail.sendTransacEmail({
                subject: "Hello from the Node SDK!",
                sender: {
                    name: "SimplyArt Team",
                    email: "simply.art213@gmail.com",
                },
                replyTo: {
                    email: "simply.art213@gmail.com",
                },
                to: [{ email: "prathammaharjan1939@gmail.com" }],
                htmlContent:
                    "<html><body><h1>This is a transactional email {{params.bodyMessage}}</h1></body></html>",
                params: { bodyMessage: "Made just for you!" },
            });
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
};

module.exports = testEmailRoute;
