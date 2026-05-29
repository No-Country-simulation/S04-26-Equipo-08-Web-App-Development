import { uploadDocument } from "@/services/document.service";
import { useMutation } from "@tanstack/react-query";

export function useDocumentUpload() {
  return useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: string }) =>
      uploadDocument(file, docType),
  });
}
