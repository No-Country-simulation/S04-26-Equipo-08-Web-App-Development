import { db } from "../config/database.js";
import { notifySender } from "../utils/notifySender.js";

export const getOnboardingProgress = async (userId) => {
  const profile = await db.query(
    "SELECT id, onboarding_status FROM contractor_profiles WHERE user_id = $1",
    [userId],
  );

  if (profile.rows.length === 0) {
    return {
      profileExists: false,
      onboardingStatus: null,
      steps: [],
    };
  }

  const profileId = profile.rows[0].id;

  const steps = await db.query(
    `
    SELECT step_name, completed, completed_at, notes
    FROM onboarding_steps
    WHERE contractor_profile_id = $1
    ORDER BY
      CASE step_name
        WHEN 'personal_info' THEN 1
        WHEN 'document_upload' THEN 2
        WHEN 'contract_sign' THEN 3
        WHEN 'payment_setup' THEN 4
        WHEN 'identity_verification' THEN 5
      END
    `,
    [profileId],
  );

  return {
    profileExists: true,
    onboardingStatus: profile.rows[0].onboarding_status,
    steps: steps.rows,
  };
};

export const completePersonalInfo = async (userId, userRole, data) => {
  const {
    firstname,
    lastname,
    country,
    city,
    address,
    document_type,
    document_number,
    birth_date,
  } = data;

  if (userRole !== "contractor") {
    throw new Error("Only contractors can access this endpoint");
  }

  if (
    !firstname?.trim() ||
    !lastname?.trim() ||
    !country?.trim() ||
    !city?.trim() ||
    !address?.trim() ||
    !document_type?.trim() ||
    !document_number?.trim() ||
    !birth_date
  ) {
    throw new Error("Missing required fields");
  }

  let contractorProfile = await db.query(
    `
    SELECT * 
    FROM contractor_profiles
    WHERE user_id = $1
    `,
    [userId],
  );

  let contractorProfileId;

  if (contractorProfile.rows.length === 0) {
    const newProfile = await db.query(
      `
      INSERT INTO contractor_profiles (
        user_id,
        onboarding_status
      )
      VALUES ($1, 'IN_PROGRESS')
      RETURNING *
      `,
      [userId],
    );

    contractorProfileId = newProfile.rows[0].id;
  } else {
    contractorProfileId = contractorProfile.rows[0].id;
  }
  const operatorEvent = await db.query(
    "SELECT performed_by FROM onboarding_events WHERE contractor_profile_id = $1",
    [contractorProfileId],
  );
  if (operatorEvent.rowCount < 1)
    throw new Error("We couldn't find the operator to notify.");
  const operatorId = operatorEvent.rows[0].performed_by;
  const operator = await db.query(
    "SELECT email FROM users WHERE id=$1",
    [operatorId],
  );
  const existingStep = await db.query(
    `
    SELECT *
    FROM onboarding_steps
    WHERE contractor_profile_id = $1
      AND step_name = 'personal_info'
    `,
    [contractorProfileId],
  );

  if (existingStep.rows.length > 0 && existingStep.rows[0].completed) {
    throw new Error("Personal info already completed");
  }

  await db.query(
    `
    UPDATE users
    SET
      firstname = $1,
      lastname = $2,
      updated_at = NOW()
    WHERE id = $3
    `,
    [firstname, lastname, userId],
  );

  await db.query(
    `
    UPDATE contractor_profiles
    SET
      country = $1,
      city = $2,
      address = $3,
      document_type = $4,
      document_number = $5,
      birth_date = $6,
      onboarding_status = 'IN_PROGRESS',
      updated_at = NOW()
    WHERE id = $7
    `,
    [
      country,
      city,
      address,
      document_type,
      document_number,
      birth_date,
      contractorProfileId,
    ],
  );

  if (existingStep.rows.length === 0) {
    await db.query(
      `
      INSERT INTO onboarding_steps (
        contractor_profile_id,
        step_name,
        completed,
        completed_at
      )
      VALUES ($1, 'personal_info', true, NOW())
      `,
      [contractorProfileId],
    );
  } else {
    await db.query(
      `
      UPDATE onboarding_steps
      SET
        completed = true,
        completed_at = NOW()
      WHERE contractor_profile_id = $1
        AND step_name = 'personal_info'
      `,
      [contractorProfileId],
    );
  }

  await db.query(
    `
    INSERT INTO onboarding_events (
      contractor_profile_id,
      event_type,
      description,
      performed_by
    )
    VALUES (
      $1,
      'PERSONAL_INFO_COMPLETED',
      'Contractor completed personal information step',
      $2
    )
    `,
    [contractorProfileId, operatorId],
  );

  const contractor = await db.query("SELECT id, email FROM users WHERE id = $1", [userId]);

  await notifySender(
    { userId: operatorId, email: operator.rows[0].email },
    {
      subject: "Completación de Fase Personal Info",
      title: "Fase Personal Info Completada",
      emailMessage: `El contratista ${userId} ha completado la información personal correctamente.`,
    },
    "email",
  );

  await notifySender(
    { userId: contractor.rows[0].id, email: contractor.rows[0].email },
    {
      subject: "Información Personal Recibida",
      title: "Información Personal Recibida",
      emailMessage: "Hemos recibido tu información personal correctamente. Continúa con el siguiente paso del onboarding.",
    },
    "email",
  );

  return {
    message: "Personal info completed successfully",
  };
};
