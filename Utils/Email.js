require("dotenv").config();

const emailAPI = require("sib-api-v3-sdk");
const client = emailAPI.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const sendTEmail = async ({ to, from, subject, text }) => {
  const mail = new emailAPI.TransactionalEmailsApi();

  try {
    const sendSmtpEmail = {
      to: [{ email: to }],
      sender: {name: "SimplyArt Team", email: from }, 
      subject,
      textContent: text,
    };

    const response = await mail.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendTEmail;