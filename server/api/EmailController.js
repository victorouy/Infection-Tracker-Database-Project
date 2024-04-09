const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
var db = require("../db");

function sendEmail(facilityID, recipient, subject, emailBody, reason) {
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
    .then(async (info) => {
      console.log(`Email successfully sent to ${recipient}`);
      const date = formatDate(new Date());
      await addEmailLogs(
        date,
        facilityID,
        recipient,
        subject,
        emailBody,
        reason
      );
    })
    .catch((err) => {
      console.log(`Failed to send email to ${recipient}: ${err}`);
    });
}

async function addEmailLogs(
  date,
  facilityID,
  recipient,
  subject,
  emailBody,
  reason
) {
  const query = `INSERT INTO Emails (Date, FacilityID, Receiver, Subject, Body, Reason) VALUES ('${date}', ${facilityID}, '${recipient}', '${subject}', '${emailBody.substring(
    0,
    100
  )}', '${reason}')`;
  console.log(query);
  db.query(query, (error) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return;
    }

    console.log("Email log inserted in database successfully");
  });
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = { sendEmail };
