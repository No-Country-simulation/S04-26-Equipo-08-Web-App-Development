import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config()

export const whatsappMessage = async (theToNumber, theMessage) => {
  try {
    const client = twilio(process.env.ACCOUNT_SSID, process.env.AUTH_TWILIO_TOKEN);
    return await client.messages.create({
        from: "whatsapp:+13185692652",
        to: `whatsapp:${theToNumber}`,
        body: theMessage,
      });
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};
