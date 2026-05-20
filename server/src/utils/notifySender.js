import { whatsappMessage } from "./whatsappTwilio";
import { db } from "../config/database";
import { brevoSend } from "./brevoSettings";
export const notifySender = async (userData, contentInfo, type) => {
  try {
    const { userId, email, phone, username } = userData;
    if (!userId) return "User Identification is needed to notify on DB.";
    if (type == "email") {
      if (!email) return "Email Needed.";
      const notifyEmail = await brevoSend(
        { email, username },
        { subject: contentInfo.subject, message: contentInfo.emailMessage },
      );
      if (notifyEmail != undefined) {
        const notifyDB = await db.query(
          "INSERT INTO notifications (user_id, title, message, type,) VALUES ($1, $2, $3, $4)",
          [userId, contentInfo.title, contentInfo.emailMessage, type],
        );
      } else return "Error Sending the Email, try again later...";

      if (notifyDB.rowCount.length > 0)
        return { message: "Notified Successfully!" };
      else
        return "Something mismatched between the DB and the email request, try again later.";
    } else if (type == "whatsapp") {
      if (!phone) return "Phone Number Needed";
      const regex = process.env.WHATSAPP_REGEX;
      const theRegex = new RegExp(regex);
      if (!theRegex.test(phone))
        return "Invalid Phone Format. Whatsapp Format Needed.";
      const whatsNotification = await whatsappMessage(
        phone,
        `${contentInfo.whatsappMessage}`,
      );
      if (whatsNotification.errorMessage != null)
        return `Something happened sending the Whatsapp message: ${whatsNotification.errorMessage}`;
      const notifyDB = await db.query(
        "INSERT INTO notifications (user_id, title, message, type,) VALUES ($1, $2, $3, $4)",
        [userId, contentInfo.title, contentInfo.whatsappMessage, type],
      );
      if (notifyDB.rowCount == 1)
        return { message: "Whatsapp successfully sent!" };
      else
        return "Something went wrong on the DB with the whatsapp, try again later...";
    } else if (type == "both") {
      if (!email || !phone)
        return "You need email and phone to send a notification of this kind.";
      const regex = process.env.WHATSAPP_REGEX;
      const theRegex = new RegExp(regex);
      if (!theRegex.test(phone))
        return "Invalid Phone Format. Whatsapp Format Needed.";
      const notifyEmail = await brevoSend(
        { email, username },
        { subject: contentInfo.subject, message: contentInfo.emailMessage },
      );

      const whatsNotification = await whatsappMessage(
        phone,
        `${contentInfo.whatsappMessage}`,
      );
      if (notifyEmail != undefined && whatsNotification.error == null) {
        const notifyDBByEmail = await db.query(
          "INSERT INTO notifications (user_id, title, message, type,) VALUES ($1, $2, $3, $4)",
          [userId, contentInfo.title, contentInfo.message, "email"],
        );
        const notifyDBWhats = await db.query(
          "INSERT INTO notifications (user_id, title, message, type,) VALUES ($1, $2, $3, $4)",
          [userId, contentInfo.title, contentInfo.message, "whatsapp"],
        );
      } else
        return "There was a problem sending one of the messages, try again later...";

      if (notifyDBByEmail.rows.length > 0 && notifyDBWhats.rows.length > 0)
        return { message: "Success!" };
      else
        return "Something went wrong trying to send both notifications, try again later...";
    }
  } catch (error) {
    return { error: error?.message };
  }
};
