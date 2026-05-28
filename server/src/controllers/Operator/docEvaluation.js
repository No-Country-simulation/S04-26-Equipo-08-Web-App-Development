import { db } from "../../config/database.js";
import { notifySender } from "../../utils/notifySender.js";
export const docEvaluation = async (docId, operatorId, rejectionReason) => {
  try {
    if (rejectionReason == undefined) {
      const doc = await db.query("SELECT * FROM documents WHERE id =$1", [
        docId,
      ]);

      if (doc.rowCount < 1)
        throw new Error("We couldn't find that Document, try again later...");

      const updating = await db.query(
        `UPDATE documents 
        SET 
          status = $1,
          reviewed_by= $2,
          reviewed_at= NOW()
          WHERE id = $3
          RETURNING *`,
        ["approved", operatorId, docId],
      );
      const user =
        await db.query(`SELECT u.id AS userId, u.email, u.role, u.phone, FROM contractor_profiles cp
JOIN users u ON cp.user_id = u.id
WHERE cp.id = '${doc.rows[0].contractor_profile_id}'`);
      if (updating.rowCount > 0) {
        const registerOnboardingEvent = await db.query(
          "INSERT INTO onboarding_events (contractor_profile_id, event_type, description, performed_by) VALUES($1, $2, $3, $4) RETURNING *",
          [
            doc.rows[0].contractor_profile_id,
            "DOCUMENT_APPROVAL",
            "Documentación aprobada!",
            operatorId,
          ],
        );
        const updateStep = await db.query(
          `UPDATE onboarding_step
            SET
              completed = $1,
              completed_at = NOW()
            WHERE contractor_profile_id = $2 AND step_name = $3`,
          [true, doc.rows[0].contractor_profile_id, "document_upload"],
        );
        if (updateStep.rowCount > 0) {
          await notifySender(
            { email: user.rows[0].email, userId: user.rows[0].id },
            {
              subject: "Documentación Aprobada",
              title: "Tu Documentación ha sido aprobada.",
              message: "Documentación aprobada, puedes seguir avanzando!",
            },
          );
          return {message: "¡Documentación aprobada y registrada!"}
        } else throw new Error("Could not update step correctly...");
      } else throw new Error("There are issues updating the document status, try again later...")
    } else {
        const doc = await db.query("SELECT * FROM documents WHERE id =$1", [
        docId,
      ]);

      if (doc.rowCount < 1)
        throw new Error("We couldn't find that Document, try again later...");

      const updating = await db.query(
        `UPDATE documents 
        SET 
          status = $1,
          reviewed_by= $2,
          reviewed_at= NOW(),
          rejection_reason= $3
          WHERE id = $4`,
        ["rejected", operatorId, rejectionReason, docId],
      );
      const user =
        await db.query(`SELECT u.id AS userId, u.email, u.role, u.phone, FROM contractor_profiles cp
JOIN users u ON cp.user_id = u.id
WHERE cp.id = '${doc.rows[0].contractor_profile_id}'`);
      if (updating.rowCount > 0) {
        const registerOnboardingEvent = await db.query(
          "INSERT INTO onboarding_events (contractor_profile_id, event_type, description, performed_by) VALUES($1, $2, $3, $4) RETURNING *",
          [
            doc.rows[0].contractor_profile_id,
            "DOCUMENT_REJECTED",
            "Documentación Rechazada",
            operatorId,
          ],
        );
        const updateStep = await db.query(
          `UPDATE onboarding_step
            SET
              completed = $1,
              completed_at = NOW()
            WHERE contractor_profile_id = $2 AND step_name = $3`,
          [false, doc.rows[0].contractor_profile_id, "document_upload"],
        );
        if (updateStep.rowCount > 0) {
          await notifySender(
            { email: user.rows[0].email, userId: user.rows[0].id },
            {
              subject: "Documentación Rechazada",
              title: "Tu Documentación ha sido rechazada.",
              message: `<html><body>Documentación Rechazada.<br> Motivo: ${rejectionReason}<br> Es necesario que corrijas y proporciones otro documento alternativo que cumpla con los estándares de la plataforma. Ten un gran día!</body></html>`,
            },
          );
          return {message: "Documentación Rechazada correctamente."}
        } else throw new Error("Could not update step correctly...");
      } else throw new Error("There are issues updating the document status, try again later...")
    }
  } catch (error) {
    throw new Error(error);
  }
};
