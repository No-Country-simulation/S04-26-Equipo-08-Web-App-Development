import { db } from "../../config/database";

export const documentDetail = async (docId) => {
  try {
    if (!docId) throw new Error("Id of Document Needed.");

    const theDoc = await db.query("SELECT * FROM documents WHERE id = $1", [
      docId,
    ]);

    return theDoc.rowCount > 0
      ? { message: "Here's the detail of the Doc", doc: theDoc.rows[0] }
      : { error: "There was not Document with that id" };
  } catch (error) {
    throw new Error(error);
  }
};
