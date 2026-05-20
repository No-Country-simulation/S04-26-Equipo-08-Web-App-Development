import { generateToken } from "../../utils/jwt";
import { brevoSend } from "../../utils/brevoSettings";
import db from "../../config/database.js";
import { whatsappMessage } from "../../utils/whatsappTwilio.js";
import { notifySender } from "../../utils/notifySender.js";

export const magicLink = async (method, receiver, operatorId, adminId) => {
  try {
    if (!adminId) return "We need Admin Authorization to continue.";
    const adminExists = await db.query(
      "SELECT email FROM users WHERE id = $1",
      [adminId],
    );
    if (adminExists.rows.length < 1)
      return "That id doesn't match any of the DB";
    else if (adminExists.rows[0].role != "admin")
      return "Only the Admin can authorize this operation.";
    const { email, number, username } = receiver;
    if (!username) return "Name of User Required...";
    if (method != "whatsapp" || method != "email")
      return "Wrong Method Argument.";
    const operator = await db.query("SELECT * FROM users WHERE id = $1", [
      operatorId,
    ]);
    const userData = {
      userId: operatorId,
      email: operator.rows[0].email,
      phone: operator.rows[0].phone,
      username: operator.rows[0].firstname,
    };
    if (method == "email") {
      if (!email || typeof email != "string")
        return "Email (of type String) Needed.";

      //Because of the DB, we must pre-register the User to mark the progress.
      const register = await db.query(
        "INSERT INTO users(email, firstname, role) VALUES ($1, $2, $3)",
        [email, username, "contractor"],
      );
      if (register.rows.length == 1) {
        const session = await generateToken(receiver, "5h");
        const contractorMessage = `<html><body> ¡Hola, ${receiver.username}!, He aquí tu link de acceso para comenzar con la activación de tu perfil como Contractor en Northpay! <br> <a href=${process.env.MAGIC_URL + "/" + session}> Link Here!</a> </body></html>`;
        const sending = await brevoSend({ session, receiver });

        if (sending) {
          //Let's Update the Flow
          const registerContractor = await db.query(
            "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2)",
            [register.rows[0].id, "INVITED"],
          );

          const onboardingSteps = await db.query(
            "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)",
            [registerContractor.rows[0].id, "personal_info", false],
          );
          const contentInfo = {
            title: "New Contractor Onboarding",
            subject: "Contractor Invited",
            emailMessage: `There's a new Contractor Invited via Magic Link into the platform! Id ${registerContractor.rows[0].id}`,
          };

          const notifying = await notifySender(userData, contentInfo, "email");

          //onboarding_events right here i guess

          return {
            message: "Link Successfully Sent! Updating Platform System!",
          };
        } else return "The Email Failed, try again later please...";
      } else
        return "Something failed making pre-register... Try again later please!";
    } else if (method == "whatsapp") {
      //Whatsapp Logic Here... Evaluating Twillio over Meta API
      if (!number)
        return "If you're going to send something via Whatsapp, send the receiver number next time!";
      const token = await generateToken(receiver, "5h");
      const sendingMessage = await whatsappMessage(
        number,
        `¡Hola! ¡He aquí el link para poder activar tu cuenta como Contractor en NorthPay! Link: https://someLink/${token}`,
      );
      if (sendingMessage?.errorMessage == null) {
        const theUser = await db.query(
          "INSERT INTO users(phone, firstname, role) VALUES ($1, $2, $3)",
          [number, username, "contractor"],
        );
        const registerContractor = await db.query(
          "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2)",
          [theUser.rows[0].id, "INVITED"],
        );

        const onboardingSteps = await db.query(
          "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)",
          [registerContractor.rows[0].id, "personal_info", false],
        );
        const contentInfo = {
          title: "New Contractor invitation",
          whatsappMessage: `There's a new Contractor Invited via Magic Link into the platform! Id ${registerContractor.rows[0].id}`,
        };
        const notifyStaff = await notifySender(
          userData,
          contentInfo,
          "whatsapp",
        );

        return { message: "¡Mensaje de Whatsapp Enviado!" };
      } else return "Error sending the message.";
    }
  } catch (error) {
    return error?.message;
  }
};
