import { supabase } from "../config/supabase.js";
import dotenv from "dotenv";
dotenv.config();
export const uploadFile = async (doc, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .upload(fileName, doc.buffer, {
        contentType: doc.mimeType,
        upsert: true,
      });

    if (error) return error;
    else return "File Successfully Uploaded to Supabase!";
  } catch (error) {
    return error;
  }
};

export const theFileUrl = async (filename) => {
  try {
    const { data: publicUrlData } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .getPublicUrl(filename);
    return { path: data.path, publicUrl: publicUrlData.publicUrl };
  } catch (error) {
    return error;
  }
};
