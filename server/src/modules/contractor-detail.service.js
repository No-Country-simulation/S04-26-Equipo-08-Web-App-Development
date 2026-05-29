import { db } from "../config/database.js";

export const getContractorDetail = async (userId) => {
  const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  if (userResult.rows.length === 0) {
    return { exists: false };
  }
  const user = userResult.rows[0];

  const profileResult = await db.query(
    "SELECT * FROM contractor_profiles WHERE user_id = $1",
    [userId],
  );
  const profile = profileResult.rows[0] || null;

  if (!profile) {
    return { exists: true, user, profile: null, steps: [], documents: [], contracts: [], paymentMethods: [], identityVerifications: [], onboardingEvents: [] };
  }

  const profileId = profile.id;

  const stepsResult = await db.query(
    `SELECT step_name, completed, completed_at, notes
     FROM onboarding_steps WHERE contractor_profile_id = $1
     ORDER BY CASE step_name
       WHEN 'personal_info' THEN 1 WHEN 'document_upload' THEN 2
       WHEN 'contract_sign' THEN 3 WHEN 'payment_setup' THEN 4
       WHEN 'identity_verification' THEN 5 END`,
    [profileId],
  );

  const docsResult = await db.query(
    "SELECT * FROM documents WHERE contractor_profile_id = $1 ORDER BY created_at DESC",
    [profileId],
  );

  const contractResult = await db.query(
    "SELECT * FROM contracts WHERE contractor_profile_id = $1 ORDER BY created_at DESC",
    [profileId],
  );

  const paymentResult = await db.query(
    "SELECT * FROM payment_methods WHERE contractor_profile_id = $1",
    [profileId],
  );

  const identityResult = await db.query(
    "SELECT * FROM identity_verifications WHERE contractor_profile_id = $1",
    [profileId],
  );

  const eventsResult = await db.query(
    `SELECT oe.*, u.email AS performed_by_email
     FROM onboarding_events oe
     LEFT JOIN users u ON oe.performed_by = u.id
     WHERE oe.contractor_profile_id = $1
     ORDER BY oe.created_at DESC`,
    [profileId],
  );

  return {
    exists: true,
    user,
    profile,
    steps: stepsResult.rows,
    documents: docsResult.rows,
    contracts: contractResult.rows,
    paymentMethods: paymentResult.rows,
    identityVerifications: identityResult.rows,
    onboardingEvents: eventsResult.rows,
  };
};
