import dotenv from "dotenv";
import { BrevoClient } from "@getbrevo/brevo";
import axios from "axios";
dotenv.config();
export async function brevoSend(userData, messageInfo) {
  try {
    const brevo = new BrevoClient({apiKey: process.env.BREVO_API_KEY, timeoutInSeconds: 30, maxRetries:2});

    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: userData.email }],
      subject: messageInfo.subject,
      htmlContent: `${messageInfo.message}`,
      replyTo: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
    });

    console.log('Brevo result:', result);
    return result;
    //res.json({
    //  success: true,
    //  messageId: result.messageId,
    //  result,
    //});
  } catch (error) {
    console.error(error);
  }
}
