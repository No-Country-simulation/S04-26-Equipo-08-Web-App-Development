import { supabase } from "../config/supabase.js";
import dotenv from "dotenv";
dotenv.config();
export const uploadFile = async (doc, fileName) => {
  try {
    console.log("bucket:", process.env.BUCKET_NAME);
    console.log("filename:", JSON.stringify(fileName));
    const {d, e} = await supabase.storage.listBuckets();
    console.log (d, e);

    const { data, error } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .upload(fileName, doc.buffer, {
        contentType: doc.mimetype,
        upsert: false,
      });

    if (error) throw error;
    const { data: publicData } = supabase.storage
      .from(process.env.BUCKET_NAME)
      .getPublicUrl(fileName);

    return { path: data.path, publicUrl: publicData.publicUrl };
  } catch (error) {
    console.error(error)
    return error;
  }
};
