import nodemailer from "nodemailer";

export const sendEmail = async (userData, messageInfo) => {
  if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
    console.warn("sendEmail skipped: NODEMAILER_USER or NODEMAILER_PASS not set");
    return { messageId: "skipped" };
  }
  try {
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    });
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: userData.email,
      subject: messageInfo.subject,
      html: messageInfo.message,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log("Email sent:", sent.messageId);
    return sent;
  } catch (error) {
    console.error("sendEmail error:", error?.message || error);
    return error?.message;
  }
};
