import nodemailer from "nodemailer";

export const sendEmail = async (userData, messageInfo) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: userData.email,
      subject: messageInfo.subject,
      html: messageInfo.message,
    };
    const sent = await transporter.sendMail(mailOptions);
    console.log(sent);
    return sent;
  } catch (error) {
    return error?.message;
  }
};
