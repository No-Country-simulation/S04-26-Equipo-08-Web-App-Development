import { db } from "../../config/database.js";

export const docusealWebhookHandler = async (req, res) => {
  try {
    const { event_type, data } = req.body;

    if (event_type !== "submission.completed") {
      return res.status(200).json({ received: true });
    }

    const submitter = data?.submitters?.[0];
    if (!submitter?.email) {
      return res.status(200).json({ received: true });
    }

    const user = await db.query("SELECT id FROM users WHERE email = $1", [submitter.email]);
    if (user.rowCount === 0) {
      return res.status(200).json({ received: true });
    }

    const profile = await db.query(
      "SELECT id FROM contractor_profiles WHERE user_id = $1",
      [user.rows[0].id],
    );
    if (profile.rowCount === 0) {
      return res.status(200).json({ received: true });
    }

    const profileId = profile.rows[0].id;

    const existingStep = await db.query(
      "SELECT * FROM onboarding_steps WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'",
      [profileId],
    );

    if (existingStep.rows.length > 0) {
      await db.query(
        `UPDATE onboarding_steps SET completed = true, completed_at = NOW()
         WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'`,
        [profileId],
      );
    } else {
      await db.query(
        `INSERT INTO onboarding_steps (contractor_profile_id, step_name, completed, completed_at)
         VALUES ($1, 'contract_sign', true, NOW())`,
        [profileId],
      );
    }

    await db.query(
      `INSERT INTO onboarding_events (contractor_profile_id, event_type, description)
       VALUES ($1, 'CONTRACT_SIGNED', 'Contract signed via DocuSeal')`,
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

      const { notifySender } = await import("../utils/notifySender.js");
      await notifySender(
        { userId: operatorEvent.rows[0].performed_by, email: operator.rows[0]?.email },
        {
          subject: "Contrato Firmado",
          title: "Firma de Contrato Completada",
          emailMessage: `El contratista ${user.rows[0].id} ha firmado el contrato.`,
        },
        "email",
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("DocuSeal webhook error:", error);
    res.status(500).json({ error: error.message });
  }
};
