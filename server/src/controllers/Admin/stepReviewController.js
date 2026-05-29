import { db } from "../../config/database.js";

export const reviewStep = async (profileId, stepName, action, reviewerId, notes) => {
  const actions = { approve: true, reject: false, reset: false };
  const completed = actions[action];
  if (completed === undefined) throw new Error("Action must be 'approve', 'reject', or 'reset'");

  await db.query(
    `UPDATE onboarding_steps
     SET completed = $1, completed_at = CASE WHEN $1 THEN NOW() ELSE NULL END, notes = $3
     WHERE contractor_profile_id = $2 AND step_name = $4`,
    [completed, profileId, notes || null, stepName],
  );

  const eventType = action === "approve" ? "STEP_APPROVED" : action === "reject" ? "STEP_REJECTED" : "STEP_RESET";
  await db.query(
    `INSERT INTO onboarding_events (contractor_profile_id, event_type, description, performed_by)
     VALUES ($1, $2, $3, $4)`,
    [profileId, eventType, `Step ${stepName} ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "reset to pending"}`, reviewerId],
  );

  return { message: `Step ${stepName} ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "reset"} successfully` };
};
