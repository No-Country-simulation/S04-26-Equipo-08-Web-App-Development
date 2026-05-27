import { generateToken } from "../../utils/jwt.js";
import { db } from "../../config/database.js";
import { whatsappMessage } from "../../utils/whatsappTwilio.js";
import { notifySender } from "../../utils/notifySender.js";
import { sendEmail } from "../../utils/nodemailer.js";
import bcrypt from "bcrypt";

export const magicLink = async (receiver, operatorId, adminId) => {
  try {
    if (!adminId) return "We need Admin Authorization to continue.";
    const adminExists = await db.query("SELECT * FROM users WHERE id = $1", [
      adminId,
    ]);

    if (adminExists.rows.length < 1) return "User (Admin) not Found.";
    else if (adminExists.rows[0].role != "admin")
      return "Only the Admin can authorize this operation.";
    const { email, number } = receiver;

    const operator = await db.query("SELECT * FROM users WHERE id = $1", [
      operatorId,
    ]);
    const operatorData = {
      userId: operatorId,
      email: operator.rows[0].email,
      phone: operator.rows[0].phone,
    };
    const temporalPass = await bcrypt.hash("northPass201", 12);

    if (email != undefined && email != null) {
      //Because of the DB, we must pre-register the User to mark the progress.
      const userExists = await db.query(
        "SELECT email FROM users WHERE email = $1",
        [email],
      );

      if (userExists.rowCount == 1)
        return "There is an User that has the same email.";

      const register = await db.query(
        "INSERT INTO users(email, role, password) VALUES ($1, $2, $3) RETURNING *",
        [email, "contractor", temporalPass],
      );

      if (register.rowCount == 1) {
        const session = await generateToken(receiver, "5h");
        const contractorMessage = `<html><body> ¡Hola! He aquí tu link de acceso para comenzar con la activación de tu perfil como Contractor en Northpay! <br> <a href=${process.env.MAGIC_URL + "/" + session}> Link Here!</a><br> <p>Tu Contraseña Temporal es: northPass201</p> </body></html>`;

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
          const onboarding_events = await db.query(
            "INSERT INTO onboarding_events(contractor_profile_id, event_type, description, performed_by) VALUES ($1, $2, $3, $4) RETURNING *",
            [
              registerContractor.rows[0].id,
              "Invitación Nuevo Usuario",
              `Se ha invitado al nuevo Contratista con id: ${register.rows[0].id}`,
              operatorId,
            ],
          );
          const contentInfo = {
            title: "New Contractor Onboarding",
            subject: "Contractor Invited",
            emailMessage: `There's a new Contractor Invited via Magic Link into the platform! Id ${registerContractor.rows[0].id}`,
          };

          const notifying = await notifySender(
            operatorData,
            contentInfo,
            "email",
          );

          if (notifying?.message)
            return {
              message: notifying.message,
            };
          else
            return `Something happened notifying the Operator, let's see: ${notifying}`;
        } else return `The email failed, let's see the reason: ${sending}`;
      } else
        return "Something failed making pre-register... Try again later please!";
    } else if (number != undefined && number != null) {
      const userExists = await db.query(
        "SELECT phone FROM users WHERE phone = $1",
        [number],
      );

      if (userExists.rowCount == 1)
        return "There's a User registered with that phoneNumber, please try another.";

      const theUser = await db.query(
        "INSERT INTO users(phone, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [number, "contractor", "newUser@practice.com", temporalPass],
      );

      if (theUser.rowCount < 1)
        return "Issues creating user, try again later...";
      const registerContractor = await db.query(
        "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2) RETURNING *",
        [theUser.rows[0].id, "INVITED"],
      );

      if (registerContractor.rowCount < 1)
        return "Failed registering Contractor";
      const onboardingSteps = await db.query(
        "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)",
        [registerContractor.rows[0].id, "personal_info", false],
      );
      const onboarding_events = await db.query(
        "INSERT INTO onboarding_events(contractor_profile_id, event_type, description, performed_by) VALUES ($1, $2, $3, $4) RETURNING *",
        [
          registerContractor.rows[0].id,
          "Invitación Nuevo Usuario",
          `Se ha invitado al nuevo Contratista con id: ${theUser.rows[0].id}`,
          operatorId,
        ],
      );
      if (onboardingSteps.rowCount > 0 && onboarding_events.rowCount > 0) {
        const token = await generateToken({ userId: theUser.rows[0].Id }, "5h");
        const userContentInfo = {
          title: "Invitacion a Nortphay",
          whatsappMessage: `¡Hola! ¡He aquí el link para poder activar tu cuenta como Contractor en NorthPay! Link: https://someLink/${token}. Tu Contraseña: northPass201`,
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

        if (notifyStaff?.message && notifyUser?.message)
          return {
            operatorMessage: notifyStaff.message,
            userMessage: notifyUser.message,
          };
        else
          return `Something went wrong notifying the Operator: ${notifyStaff}`;
      } else return "Error sending the message.";
    } else return "Empty Object. Could not do anything without it...";
  } catch (error) {
    return error?.message;
  }
};
