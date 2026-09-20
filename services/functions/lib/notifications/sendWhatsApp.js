"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = sendWhatsAppMessage;
const functions = __importStar(require("firebase-functions"));
/**
 * Sends a WhatsApp message via the Meta WhatsApp Cloud API.
 * Requires a verified WhatsApp Business number + permanent access token.
 * Swap this out for Twilio's API with minimal changes if preferred.
 */
async function sendWhatsAppMessage(toPhone, message) {
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
//# sourceMappingURL=sendWhatsApp.js.map