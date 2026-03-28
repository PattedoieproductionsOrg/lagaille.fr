import type { FaqData } from "../types/faq";

const API_URL = import.meta.env.PUBLIC_WISPRA_API_URL || "https://api.wispra.fr";
const PUBLIC_CODE = import.meta.env.PUBLIC_WISPRA_FAQ_API_KEY;

export async function getFaq(): Promise<FaqData> {
  const response = await fetch(`${API_URL}/faq/public/${PUBLIC_CODE}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return await response.json();
}
