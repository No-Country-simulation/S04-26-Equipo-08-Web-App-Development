import { db } from "../../../config/database.js";
import dotenv from "dotenv";
import crypto from "crypto";
import { uploadFile } from "../../../utils/supabaseUpload.js";
import { notifySender } from "../../../utils/notifySender.js";
dotenv.config();
export const documentUpload = async (userData, document, docType) => {
  try {
    const { role, id, email } = userData;
    if (role != "contractor") return "You must be a Contractor to do this...";
    const verifyDocType = ["passport", "id_card", "tax_form", "address_proof", "certificate", "diploma", "professional_license", "others"];
    
    if (verifyDocType.includes(docType) == false) return "The DocType is invalid.";
    const contractorProfile = await db.query(
      "SELECT * FROM contractor_profiles WHERE user_id = $1",
      [id],
    );
    
    if (contractorProfile.rowCount == 0)
      return "We couldn't find a contractorProfile linked to this User, try again later.";
    const getOperator = await db.query(
      "SELECT performed_by FROM onboarding_events WHERE contractor_profile_id = $1",
      [contractorProfile.rows[0].id],
    );
    if (!getOperator.rows[0].performed_by)
      return "There was an error getting the Operator data... Try again later.";

    //Upload Logic
    const extension = document.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const uploading = await uploadFile(document, fileName);
    
    if (!uploading?.path) return { error: uploading };
    

    const registeringDoc = await db.query(
      "INSERT INTO documents(contractor_profile_id, document_type, file_url, status) VALUES($1, $2, $3, $4)",
      [contractorProfile.rows[0].id, docType, uploading.publicUrl, "pending"],
    );

    if (registeringDoc.rowCount > 0) {
      const registerSteps = await db.query(
        "INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES($1, $2, $3)",
        [contractorProfile.rows[0].id, "document_upload", true],
      );
      const registerEvent = await db.query(
        "INSERT INTO onboarding_events(contractor_profile_id, event_type, description, performed_by) VALUES ($1, $2, $3, $4)",
        [
          contractorProfile.rows[0].id,
          "Document Uploading",
          `Subida de Documentos por parte del usuario ${id}`,
          getOperator.rows[0].performed_by,
        ],
      );
      if (registerSteps.rowCount > 0 && registerEvent.rowCount > 0) {
        const notifyStaff = await notifySender(
          { userId: getOperator.rows[0].performed_by, email },
          {
            subject: `Contratista de id ${id} ha enviado la documentación de la fase Document Upload`,
            title: "Completación Subida de Documentos",
            emailMessage:
              "El usuario envió los docs en la fase Document Upload, pasando a la siguiente fase!",
          },
          "email"
        );

        return notifyStaff.message
          ? {
              message: "Document Upload Phase Successfully Completed!",
              file: uploading.publicUrl,
            }
          : notifyStaff
      }
    }
  } catch (error) {
    return error;
  }
};
