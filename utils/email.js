import nodemailer from "nodemailer";

/**
 * Sends a plain-text email through Gmail SMTP.
 *
 * Requires EMAIL_USER and EMAIL_PASSWORD in the environment.
 * Accepts `{ to, subject, message }` and returns Nodemailer's send result.
 */
const sendEmail = async function ({ to, subject, message }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Classwise" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: message,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
