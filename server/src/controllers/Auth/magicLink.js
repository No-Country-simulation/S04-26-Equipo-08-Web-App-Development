import { generateToken } from "../../utils/jwt.js";
import { db } from "../../config/database.js";
import { notifySender } from "../../utils/notifySender.js";
import { sendEmail } from "../../utils/nodemailer.js";
import bcrypt from "bcrypt";

function createError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export const magicLink = async (receiver, operatorId, adminId) => {
  try {
    if (!adminId) throw createError("Se requiere autorización de administrador", 401);

    const adminExists = await db.query("SELECT * FROM users WHERE id = $1", [adminId]);
    if (adminExists.rows.length < 1) throw createError("Usuario (Admin) no encontrado", 404);
    if (!["admin", "operator"].includes(adminExists.rows[0].role)) throw createError("No tienes permisos para invitar contratistas", 403);

    const { email, number } = receiver;
    if (!email && !number) throw createError("Se requiere correo electrónico o número de teléfono", 400);

    const operator = await db.query("SELECT * FROM users WHERE id = $1", [operatorId]);
    const operatorData = {
      userId: operatorId,
      email: operator.rows[0]?.email,
      phone: operator.rows[0]?.phone,
    };
    const temporalPass = await bcrypt.hash("northPass201", 12);

    if (email) {
      const userExists = await db.query("SELECT id, email FROM users WHERE email = $1", [email]);
      if (userExists.rowCount == 1) {
        const existingUser = userExists.rows[0];
        console.log(`Reinvitando: eliminando usuario existente ${existingUser.id}`);
        await db.query("DELETE FROM users WHERE id = $1", [existingUser.id]);
      }

      const register = await db.query(
        "INSERT INTO users(email, role, password) VALUES ($1, $2, $3) RETURNING *",
        [email, "contractor", temporalPass],
      );
      if (register.rowCount < 1) throw createError("Error al crear el usuario", 500);

      const session = await generateToken(receiver, "5h");
      const contractorMessage = `<html><body> ¡Hola! He aquí tu link de acceso para comenzar con la activación de tu perfil como Contractor en Northpay! <br> <a href=${process.env.MAGIC_URL + "/" + session}> Link Here!</a><br> <p>Tu Contraseña Temporal es: northPass201</p> </body></html>`;

      const sending = await sendEmail(
        { email: receiver.email },
        { subject: "NorthPay Email", message: contractorMessage },
      );

      if (sending?.rejected?.length !== 0) {
        throw createError(`El correo no pudo ser enviado: ${typeof sending === "string" ? sending : "error desconocido"}`, 502);
      }

      const registerContractor = await db.query(
        "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2) RETURNING *",
        [register.rows[0].id, "INVITED"],
      );

      await db.query(
        "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)",
        [registerContractor.rows[0].id, "personal_info", false],
      );
      await db.query(
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

      const notifying = await notifySender(operatorData, contentInfo, "email");
      if (!notifying?.message) {
        console.warn("notifySender falló:", notifying);
      }

      return { message: "Invitación enviada exitosamente" };
    }

    if (number) {
      const userExists = await db.query("SELECT id, phone FROM users WHERE phone = $1", [number]);
      if (userExists.rowCount == 1) {
        const existingUser = userExists.rows[0];
        console.log(`Reinvitando: eliminando usuario existente ${existingUser.id}`);
        await db.query("DELETE FROM users WHERE id = $1", [existingUser.id]);
      }

      const theUser = await db.query(
        "INSERT INTO users(phone, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [number, "contractor", "newUser@practice.com", temporalPass],
      );
      if (theUser.rowCount < 1) throw createError("Error al crear el usuario", 500);

      const registerContractor = await db.query(
        "INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2) RETURNING *",
        [theUser.rows[0].id, "INVITED"],
      );
      if (registerContractor.rowCount < 1) throw createError("Error al registrar el contratista", 500);

      await db.query(
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
      if (onboarding_events.rowCount < 1) throw createError("Error al registrar el evento de onboarding", 500);

      const token = await generateToken({ userId: theUser.rows[0].id }, "5h");
      const userContentInfo = {
        title: "Invitacion a Nortphay",
        whatsappMessage: `¡Hola! ¡He aquí el link para poder activar tu cuenta como Contractor en NorthPay! Link: ${process.env.MAGIC_URL}/${token}. Tu Contraseña Temporal: northPass201`,
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
      const notifyStaff = await notifySender(operatorData, operatorContentInfo, "whatsapp");

      return {
        operatorMessage: notifyStaff?.message || "Invitación enviada",
        userMessage: notifyUser?.message || "Invitación enviada",
      };
    }
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error inesperado en magicLink:", error);
    throw createError("Error interno del servidor", 500);
  }
};
