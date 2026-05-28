import { db } from "../../config/database.js";
import "dotenv/config";

export const getDocuments = async (filter, data) => {
  try {
    if (!filter) {
      const theDocs = await db.query("SELECT * FROM documents d JOIN contractor_profiles cp ON d.contractor_profile_id = cp.id JOIN users u ON cp.user_id= u.id;");
      return theDocs.rowCount > 0
        ? { message: "Success!", data: theDocs }
        : { error: "Docs were not found." };
    } else {
        if(filter=="status"){
            if (!data.status) throw new Error("Status property needed.");
            if (typeof data.status != "string") throw new Error("Status must be a string.");
            const status = data.status.trim().toLowerCase();
            const theDocs = await db.query("SELECT u.id AS user_id, u.email, u.firstname, d.id AS document_id, d.document_type, d.status, d.created_at, d.file_url FROM documents d JOIN contractor_profiles cp ON d.contractor_profile_id = cp.id JOIN users u ON cp.user_id= u.id WHERE d.status = $1", [status]);

            return theDocs.rowCount > 0 ? {message: "Success!", data: theDocs.rows} : {error:"Docs were not Found."}
        } else if(filter == "contractor"){
            if (!data.contractor_id) throw new Error("Contractor Id property needed.");
            if (typeof data.contractor_id != "string") throw new Error("Contractor ID must be a string.");
            const theDocs = await db.query("SELECT u.id AS user_id, u.email, u.firstname, d.id AS document_id, d.document_type, d.status, d.created_at, d.file_url FROM documents d JOIN contractor_profiles cp ON d.contractor_profile_id = cp.id JOIN users u ON cp.user_id= u.id WHERE d.contractor_profile_id = $1", [data.contractor_id]);

            return theDocs.rowCount > 0 ? {message: "Success!", data: theDocs.rows} : {error:"Docs were not Found."}
        }
    }
  } catch (error) {
    throw new Error(error);
  }
};
