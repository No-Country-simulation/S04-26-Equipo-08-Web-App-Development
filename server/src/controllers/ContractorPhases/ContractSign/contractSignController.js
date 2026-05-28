import { db } from "../../../config/database.js";
import { createSubmission } from "../../../utils/docuseal.js";

export const contractSign = async (userData) => {
  const { role, id } = userData;
  if (role !== "contractor") return "You must be a Contractor to do this...";

  const profile = await db.query(
    "SELECT id FROM contractor_profiles WHERE user_id = $1",
    [id],
  );
  if (profile.rowCount === 0) return "Contractor profile not found";

  const profileId = profile.rows[0].id;

  const existingStep = await db.query(
    "SELECT * FROM onboarding_steps WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'",
    [profileId],
  );
  if (existingStep.rows.length > 0 && existingStep.rows[0].completed) {
    return { message: "Contract already signed" };
  }

  await db.query(
    `INSERT INTO onboarding_steps (contractor_profile_id, step_name, completed)
     VALUES ($1, 'contract_sign', false)
     ON CONFLICT DO NOTHING`,
    [profileId],
  );

  // Fallback sin API key: usar URL pública de DocuSeal
  if (!process.env.DOCUSEAL_API_KEY) {
    return { embedSrc: "https://docuseal.com/d/3yY4u5GdE1tPC7", fallback: true };
  }

  const templateId = process.env.DOCUSEAL_TEMPLATE_ID;
  if (!templateId) throw new Error("DOCUSEAL_TEMPLATE_ID no configurado");

  const { email } = userData;
  const user = await db.query("SELECT firstname, lastname FROM users WHERE id = $1", [id]);
  const name = `${user.rows[0]?.firstname || ""} ${user.rows[0]?.lastname || ""}`.trim() || email;

  const redirectUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/contractors/step4`;

  const submission = await createSubmission({
    templateId: Number(templateId),
    email,
    name,
    redirectUrl,
  });

  const submitter = submission?.[0];
  if (!submitter?.embed_src) throw new Error("No se pudo obtener el embed_src de DocuSeal");

  return { embedSrc: submitter.embed_src };
};
