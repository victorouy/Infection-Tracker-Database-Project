const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

function sendEmail(recipient, subject, emailBody) {
  console.log("recipient", recipient);
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
      return res.status(201).json({
        msg: "Email sent",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((err) => {
      return res.status(500).json({ msg: err });
    });
}

module.exports = { sendEmail };
