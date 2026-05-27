import { db } from "../config/database.js";
import { notifySender } from "../utils/notifySender.js";

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
  const operatorId = await db.query(
    "SELECT performed_by FROM onboarding_events WHERE contractor_profile_id = $1",
    contractorProfileId,
  );
  if (operator.rowCount < 1)
    throw new Error("We couldn't find the operator to notify.");
  const operator = await db.query(
    "SELECT email FROM users WHERE id=$1",
    operatorId,
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
    [contractorProfileId, operatorId.rows[0].performed_by],
  );

  //Notify North Pay Assigned staff
   await notifySender(
    { userId: operatorId.rows[0].performed_by, email: operator.rows[0].email },
    {
      subject: `Completación de Fase Personal Info`,
      title: "Fase Personal Info Completed",
      emailMessage: `User ${userId} ha enviado la información en la fase Personal Info correctamente!`,
    },
    "email",
  );
  return {
    message: "Personal info completed successfully",
  };
};
