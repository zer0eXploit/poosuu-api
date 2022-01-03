import nodemailer from "nodemailer";

import accountCreationEmail from "./templates/account-creation.js";

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, ENV } = process.env;

let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

const sendEmail = async ({ from, to, subject, text, html }) => {
  if (!from || !to || !subject || !text || !html)
    throw new Error("Required function arguments are not passed to sendEmail.");

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  ENV !== "production" && console.log("Message sent: %s", info.messageId);
};

export const sendAccountCreationEmail = async (name, email, token) => {
  // Sending Activation Email
  const [html, plainText] = accountCreationEmail(name);

  await sendEmail({
    from: `"PooSuu No Reply" <noreply@poosuu.com>`,
    to: email,
    subject: "Account Activation",
    text: plainText,
    html: html,
  });
};

export default sendEmail;
