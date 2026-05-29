import { apiFetch } from "./api";

export type DocType =
  | "passport"
  | "id_card"
  | "tax_form"
  | "address_proof"
  | "certificate"
  | "diploma"
  | "professional_license"
  | "others";

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  passport: "Pasaporte",
  id_card: "Cédula de Identidad",
  tax_form: "Formulario Fiscal",
  address_proof: "Comprobante de Domicilio",
  certificate: "Certificado",
  diploma: "Título Profesional",
  professional_license: "Licencia Profesional",
  others: "Otros",
};

export async function uploadDocument(file: File, docType: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);

  return apiFetch<{ file: string; message: string }>("/doc_upload", {
    method: "POST",
    body: formData,
  });
}
