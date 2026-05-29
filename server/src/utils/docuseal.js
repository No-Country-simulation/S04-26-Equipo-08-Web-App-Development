import dotenv from "dotenv";
dotenv.config();

const DOCUSEAL_API = process.env.DOCUSEAL_API_URL || "https://api.docuseal.com";
const API_KEY = process.env.DOCUSEAL_API_KEY;

export const createSubmission = async ({ templateId, email, name, redirectUrl }) => {
  if (!API_KEY) throw new Error("DOCUSEAL_API_KEY no configurada");

  const response = await fetch(`${DOCUSEAL_API}/submissions`, {
    method: "POST",
    headers: {
      "X-Auth-Token": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_id: templateId,
      send_email: false,
      completed_redirect_url: redirectUrl,
      submitters: [
        {
          email,
          name,
          role: "Contractor",
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DocuSeal error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data;
};

export const getSubmission = async (submissionId) => {
  if (!API_KEY) throw new Error("DOCUSEAL_API_KEY no configurada");

  const response = await fetch(`${DOCUSEAL_API}/submissions/${submissionId}`, {
    headers: { "X-Auth-Token": API_KEY },
  });

  if (!response.ok) {
    throw new Error(`DocuSeal error: ${response.status}`);
  }

  return response.json();
};
