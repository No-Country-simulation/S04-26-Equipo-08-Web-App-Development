import { db } from "../../../config/database.js";
import { notifySender } from "../../../utils/notifySender.js";

export const contractComplete = async (userData) => {
  const { role, id } = userData;
  if (role !== "contractor") return "Unauthorized";

  const profile = await db.query(
    "SELECT id FROM contractor_profiles WHERE user_id = $1",
    [id],
  );
  if (profile.rowCount === 0) return "Contractor profile not found";

  const profileId = profile.rows[0].id;

  await db.query(
    `UPDATE onboarding_steps SET completed = true, completed_at = NOW()
     WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'`,
    [profileId],
  );

  await db.query(
    `INSERT INTO onboarding_events (contractor_profile_id, event_type, description)
     VALUES ($1, 'CONTRACT_SIGNED', 'Contract signed')`,
    [profileId],
  );

  const operatorEvent = await db.query(
    "SELECT performed_by FROM onboarding_events WHERE contractor_profile_id = $1 AND performed_by IS NOT NULL LIMIT 1",
    [profileId],
  );

  if (operatorEvent.rows[0]?.performed_by) {
    const operator = await db.query("SELECT email FROM users WHERE id = $1", [
      operatorEvent.rows[0].performed_by,
    ]);

    await notifySender(
      { userId: operatorEvent.rows[0].performed_by, email: operator.rows[0]?.email },
      {
        subject: "Contrato Firmado",
        title: "Firma de Contrato Completada",
        emailMessage: `El contratista ${id} ha firmado el contrato.`,
      },
      "email",
    );
  }

  return { success: true };
};
