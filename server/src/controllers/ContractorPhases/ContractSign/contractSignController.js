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

  // Verificar si el contrato ya fue firmado y registrado correctamente
  const existingContract = await db.query(
    "SELECT id, signed FROM contracts WHERE contractor_profile_id = $1",
    [profileId],
  );
  if (existingContract.rows.length > 0 && existingContract.rows[0].signed) {
    return { message: "Contract already signed" };
  }

  // Si el step está marcado como completado pero no hay contrato firmado,
  // fue un registro incompleto — lo reseteamos para permitir re-firmar
  const existingStep = await db.query(
    "SELECT * FROM onboarding_steps WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'",
    [profileId],
  );
  if (existingStep.rows.length > 0 && existingStep.rows[0].completed) {
    await db.query(
      `UPDATE onboarding_steps SET completed = false, completed_at = NULL
       WHERE contractor_profile_id = $1 AND step_name = 'contract_sign'`,
      [profileId],
    );
  } else if (existingStep.rows.length === 0) {
    await db.query(
      `INSERT INTO onboarding_steps (contractor_profile_id, step_name, completed)
       VALUES ($1, 'contract_sign', false)`,
      [profileId],
    );
  }

  let embedSrc;
  let contractUrl = null;

  // Fallback sin API key: usar URL pública de DocuSeal
  if (!process.env.DOCUSEAL_API_KEY) {
    embedSrc = "https://docuseal.com/d/3yY4u5GdE1tPC7";
  } else {
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

    embedSrc = submitter.embed_src;
    contractUrl = submitter.embed_src;
  }

  // Insertar registro en contracts si no existe
  if (existingContract.rows.length === 0) {
    await db.query(
      `INSERT INTO contracts (contractor_profile_id, contract_url, signed)
       VALUES ($1, $2, false)`,
      [profileId, contractUrl],
    );
  }

  return { embedSrc };
};
