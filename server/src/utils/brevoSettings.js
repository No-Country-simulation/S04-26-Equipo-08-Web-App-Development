import dotenv from "dotenv";
import brevo from "@getbrevo/brevo";
dotenv.config();
export async function brevoSend(userData, messageInfo) {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsAPiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const sendSmtpEmail = new brevo.sendSmtpEmail();
    sendSmtpEmail.subject = messageInfo.subject;
    sendSmtpEmail.to = [
      { email: userData.email, name: userData.username },
    ];
    sendSmtpEmail.htmlContent = `${messageInfo.message}`;
    sendSmtpEmail.sender = {
      name: "Northpay",
      email: process.env.BREVO_SENDER_EMAIL,
    };
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}
