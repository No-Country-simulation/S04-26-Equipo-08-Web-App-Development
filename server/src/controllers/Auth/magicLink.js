import { generateToken } from "../../utils/jwt.js";
import { db } from "../../config/database.js";
import { whatsappMessage } from "../../utils/whatsappTwilio.js";
import { notifySender } from "../../utils/notifySender.js";
import { sendEmail } from "../../utils/nodemailer.js";

export const magicLink = async (method, receiver, operatorId, adminId) => {
  try {
    if (!adminId) return "We need Admin Authorization to continue.";
    const adminExists = await db.query("SELECT * FROM users WHERE id = $1", [
      adminId,
    ]);

    if (adminExists.rows.length < 1)
      return "That id doesn't match any of the DB";
    else if (adminExists.rows[0].role != "admin")
      return "Only the Admin can authorize this operation.";
    const { email, number, username } = receiver;
    if (!username) return "Name of User Required...";
    if (method != "whatsapp" && method != "email")
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
      const userExists = await db.query(
        "SELECT email FROM users WHERE email = $1",
        [email],
      );

      if (userExists.rowCount == 1)
        return "There's a User registered with that email, please try another.";

      const register = await db.query(
        "INSERT INTO users(email, firstname, role) VALUES ($1, $2, $3) RETURNING *",
        [email, username, "contractor"],
      );

      if (register.rowCount == 1) {
        const session = await generateToken(receiver, "5h");
        const contractorMessage = `<html><body> ¡Hola, ${receiver.username}!, He aquí tu link de acceso para comenzar con la activación de tu perfil como Contractor en Northpay! <br> <a href=${process.env.MAGIC_URL + "/" + session}> Link Here!</a> </body></html>`;

        const sending = await sendEmail(
          { email: receiver.email },
          { subject: "NorthPay Email", message: contractorMessage },
        );

        if (sending?.rejected.length == 0) {
          //Let's Update the Flow
          const registerContractor = await db.query(
            "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2) RETURNING *",
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
          if (notifying?.message)
            return {
              message: notifying.message,
            };
          else
            return `Something happened notifying the Operator, let's see: ${notifying}`;
        } else return `The email failed, let's see the reason: ${sending}`;
      } else
        return "Something failed making pre-register... Try again later please!";
    } else if (method == "whatsapp") {
      //Whatsapp Logic Here... Evaluating Twillio over Meta API
      if (!number)
        return "If you're going to send something via Whatsapp, send the receiver number next time!";
      const userExists = await db.query(
        "SELECT phone FROM users WHERE phone = $1",
        [number],
      );

      if (userExists.rowCount == 1) await db.query("DELETE FROM users WHERE phone = $1", [number]);
        //return "There's a User registered with that phoneNumber, please try another.";

      const theUser = await db.query(
        "INSERT INTO users(phone, firstname, role, email) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          number,
          username,
          "contractor",
          email ? email : "something@practice.com",
        ],
      );
      console.log("After theUser");
      if (theUser.rowCount < 1) return "Issues creating user";
      const registerContractor = await db.query(
        "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2) RETURNING *",
        [theUser.rows[0].id, "INVITED"],
      );
      console.log("After the registerContractor");
      if (registerContractor.rowCount < 1)
        return "Failed registering Contractor";
      const onboardingSteps = await db.query(
        "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)",
        [registerContractor.rows[0].id, "personal_info", false],
      );

      if (onboardingSteps.rowCount > 0) {
        const token = await generateToken({userId: theUser.rows[0].Id}, "5h");
        const userContentInfo = {
          title: "Invitacion a Nortphay",
          whatsappMessage: `¡Hola! ¡He aquí el link para poder activar tu cuenta como Contractor en NorthPay! Link: https://someLink/${token}`,
        };
        
        const operatorContentInfo = {
          title: "New Contractor invitation",
          whatsappMessage: `There's a new Contractor Invited via Magic Link into the platform! Id ${registerContractor.rows[0].id}`,
        };
        const notifyUser = await notifySender(
          { userId: theUser.rows[0].id, phone: number },
          userContentInfo,
          "whatsapp",
        );
        const notifyStaff = await notifySender(
          userData,
          operatorContentInfo,
          "whatsapp",
        );
        console.log("After NotifyStaff");
        if (notifyStaff?.message && notifyUser?.message) return { operatorMessage: notifyStaff.message , userMessage: notifyUser.message};
        else
          return `Something went wrong notifying the Operator: ${notifyStaff}`;
      } else return "Error sending the message.";
    }
  } catch (error) {
    return error?.message;
  }
};
