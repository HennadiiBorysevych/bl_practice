const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "hennadiiborysevych@meta.ua",
    pass: "^wX$UTDpM7N440",
  },
});

async function sendEmail({ userName, userEmail, userMessage }) {
  const output = `<h2 style="color: green">
      Hello there, You have recived a message from ${userName}
    </h2>
    <p>Contact email is ${userEmail}</p>
    <p>Message: ${userMessage}</p>
    <p style="color: blue">Thank you</p>`;

  const info = await transporter.sendMail({
    from: "hennadiiborysevych@meta.ua", // sender address
    to: "genuch3@gmail.com", // list of receivers
    subject: "Message from Space website", // Subject line
    text: userMessage, // plain text body
    html: output, // html body
  });
  console.log("Message sent: %s", info.messageId);
}
module.exports = sendEmail;
