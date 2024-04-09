const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
var db = require("../db");
const tabeshController = require("./TabeshController");

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
  db.query(query, (error) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return;
    }

    console.log("Email log inserted in database successfully");
  });
}

function getAllEmails(req, res) {
  const query = `SELECT Date, f.Name as Sender, Receiver, Subject, Body, Reason FROM Emails JOIN Facilities f ON f.FacilityID = Emails.FacilityID`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ results });
  });
}

// Function to email schedules to all employees within a given time frame
async function emailEmployeeSchedules(startDate, endDate) {
  try {
    // Get schedules for all employees
    const schedules =
      await tabeshController.getEmployeeSchedulesDuringTimeframe(
        startDate,
        endDate
      );

    // Group schedules by employee ID
    const schedulesByEmployee = {};
    schedules.forEach((schedule) => {
      if (!schedulesByEmployee[schedule.EmployeeID]) {
        schedulesByEmployee[schedule.EmployeeID] = [];
      }
      schedulesByEmployee[schedule.EmployeeID].push(schedule);
    });

    // Send emails for each employee
    for (const employeeId in schedulesByEmployee) {
      const employeeSchedules = schedulesByEmployee[employeeId];
      const employee = employeeSchedules[0]; // Get employee details from any schedule

      const scheduleEmailToSend = generateScheduleEmail(
        employee,
        employeeSchedules,
        startDate,
        endDate
      );

      await sendEmail(
        scheduleEmailToSend.FacilityID,
        scheduleEmailToSend.Recipient,
        scheduleEmailToSend.Subject,
        scheduleEmailToSend.EmailBody,
        scheduleEmailToSend.Reason
      );
    }

    console.log("All schedule emails sent successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

function generateScheduleEmail(
  employee,
  employeeSchedules,
  startDate,
  endDate
) {
  const subject = `${employee.FacilityName} Schedule for ${startDate} to ${endDate}`;

  let body = `Dear ${employee.FirstName} ${employee.LastName},<br>`;
  body += "Your schedule for the coming week:<br>";

  employeeSchedules.forEach((schedule) => {
    body += `${schedule.Date}: ${schedule.StartTime} - ${schedule.EndTime}<br>`;
  });

  return {
    FacilityID: employee.FacilityID,
    Recipient: employee.EmailAddress,
    Subject: subject,
    EmailBody: body,
    Reason: "Schedule",
  };
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = { sendEmail, getAllEmails, emailEmployeeSchedules };
