import dotenv from "dotenv";
import brevo from "@getbrevo/brevo";
dotenv.config();
export async function brevoSend(userData) {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsAPiKeys.apiKey,
      process.env.BREVO_KEY,
    );

    const sendSmtpEmail = new brevo.sendSmtpEmail();
    const f =  "fewfewfewf";
    sendSmtpEmail.subject = "Access Link";
    sendSmtpEmail.to = [{ email: userData.userEmail, name: userData.name  }];
    sendSmtpEmail.htmlContent =
      `<html><body><h1> Hello, ${userData.name} This is an Email from NorthPay HR </h1><p>Here we'll display the link to activate your Contractor account</p><a href=${f}> Click Here </a></body></html>`
    sendSmtpEmail.sender = {
      name: "Northpay",
      email: process.env.BREVO_FROM_EMAIL,
    };
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error(error);
  }
}
