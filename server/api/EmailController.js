const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

function sendEmail(recipient, subject, emailBody) {
  let config = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let message = {
    from: "hfests.notifications@gmail.com",
    to: recipient,
    subject: subject,
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      console.log(`Email successfully sent to ${recipient}`);
    })
    .catch((err) => {
      console.log(`Failed to send email to ${recipient}: ${err}`);
    });
}

module.exports = { sendEmail };
