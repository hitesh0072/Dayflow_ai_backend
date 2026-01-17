import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dayflow AI" <${env.mail.user}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
