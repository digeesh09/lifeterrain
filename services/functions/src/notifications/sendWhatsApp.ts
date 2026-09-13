import * as functions from "firebase-functions";
import fetch from "node-fetch";

/**
 * Sends a WhatsApp message via the Meta WhatsApp Cloud API.
 * Requires a verified WhatsApp Business number + permanent access token.
 * Swap this out for Twilio's API with minimal changes if preferred.
 */
export async function sendWhatsAppMessage(toPhone: string, message: string) {
  const token = functions.config().whatsapp?.token ?? process.env.WHATSAPP_TOKEN;
  const phoneNumberId = functions.config().whatsapp?.phone_id ?? process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneNumberId) {
    console.warn("WhatsApp not configured — skipping message to", toPhone);
    return;
  }

  const normalized = toPhone.replace(/[^\d+]/g, "");
  await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalized,
      type: "text",
      text: { body: message },
    }),
  });
}
