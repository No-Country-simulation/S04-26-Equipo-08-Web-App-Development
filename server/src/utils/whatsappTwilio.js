import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();

export const whatsappMessage = async (theToNumber, theMessage) => {
  try {
    const client = twilio(
      process.env.ACCOUNT_SID,
      process.env.AUTH_TWILIO_TOKEN,
    );
    const answer = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${theToNumber}`,
      body: theMessage,
    });
    console.log(`Este es el answer de Whatsapp Twilio:`, answer);
    return answer;
  } catch (error) {
    console.log(error);
    throw new Error(error?.message);
  }
};
