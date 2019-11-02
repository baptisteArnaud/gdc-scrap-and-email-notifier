const nodemailer = require("nodemailer");
require("dotenv").config();
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_SMTP_EMAIL,
    pass: process.env.GMAIL_SMTP_PASSWORD
  }
});

module.exports = function sendEmail(message) {
  const mailOptions = {
    from: "baptiste.arnaud95@gmail.com",
    to: ["me@baptiste-arnaud.fr", "kathryn.schutte@gmail.com"],
    subject: "GDC alerte nouvelle annonce",
    html: message
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log(`Message sent: ${info.response}`);
  });
};
