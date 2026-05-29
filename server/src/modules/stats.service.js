import { db } from "../config/database.js";

export const getDashboardStats = async () => {
  const totalResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'contractor'");
  const total = parseInt(totalResult.rows[0].count);

  const activeResult = await db.query(
    `SELECT COUNT(*) FROM contractor_profiles WHERE onboarding_status IN ('ACTIVE', 'APPROVED')`,
  );
  const active = parseInt(activeResult.rows[0].count);

  const pendingResult = await db.query(
    `SELECT COUNT(*) FROM contractor_profiles WHERE onboarding_status IN ('INVITED', 'IN_PROGRESS')`,
  );
  const pending = parseInt(pendingResult.rows[0].count);

  const archivedResult = await db.query(
    "SELECT COUNT(*) FROM users WHERE role = 'contractor' AND is_active = false",
  );
  const archived = parseInt(archivedResult.rows[0].count);

  const stepNames = ["personal_info", "document_upload", "contract_sign", "payment_setup", "identity_verification"];
  const stepsProgress = [];

  for (const stepName of stepNames) {
    const result = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed_count
       FROM onboarding_steps
       WHERE step_name = $1`,
      [stepName],
    );
    const totalSteps = parseInt(result.rows[0].total);
    const completedCount = parseInt(result.rows[0].completed_count);
    stepsProgress.push({
      stepName,
      total: totalSteps,
      completed: completedCount,
      percentage: totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0,
    });
  }

  const recentResult = await db.query(
    `SELECT oe.*, u.email AS user_email, u.firstname, u.lastname
     FROM onboarding_events oe
     JOIN contractor_profiles cp ON oe.contractor_profile_id = cp.id
     JOIN users u ON cp.user_id = u.id
     ORDER BY oe.created_at DESC
     LIMIT 15`,
  );
  const recentActivity = recentResult.rows;

  return { total, active, pending, archived, stepsProgress, recentActivity };
};
