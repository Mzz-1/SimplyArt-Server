const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
    pool: {
        maxConnections: 1,  // change this number to the maximum allowed by your SMTP server
        maxMessages: Infinity,
        rateDelta: 1000,
        rateLimit: 4
      },
    service: "hotmail",
    auth: {
        user: "simply.art213@outlook.com",
        pass: "simplyart#1234",
    },
});

let details = {
    from: "simply.art213@outlook.com",
    to: "prathammaharjan1939@gmail.com",
    subject: "Test email",
    text: "testing first email",
};
mailTransporter.sendMail(details, (err) => {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("sent");
    }
});
