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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyEnrolled = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("../admin");
const sendEmail_1 = require("./sendEmail");
const sendWhatsApp_1 = require("./sendWhatsApp");
const corsHandler = (0, cors_1.default)({ origin: true });
/**
 * Admin-only broadcast endpoint used by apps/admin's Notifications page.
 * Verifies the caller's Firebase ID token carries the `admin` custom claim
 * before sending anything.
 */
exports.notifyEnrolled = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const authHeader = req.headers.authorization ?? "";
            const idToken = authHeader.replace("Bearer ", "");
            const decoded = await admin_1.admin.auth().verifyIdToken(idToken);
            if (!decoded.admin)
                return res.status(403).json({ error: "Admin access required" });
            const { courseSlug, channel, message } = req.body;
            const enrollmentsSnap = await admin_1.db
                .collection("enrollments")
                .where("courseSlug", "==", courseSlug)
                .where("status", "==", "confirmed")
                .get();
            let count = 0;
            for (const doc of enrollmentsSnap.docs) {
                const e = doc.data();
                if (channel !== "whatsapp")
                    await (0, sendEmail_1.sendCustomEmail)(e.email, e.name, e.courseTitle, message).catch(console.error);
                if (channel !== "email")
                    await (0, sendWhatsApp_1.sendWhatsAppMessage)(e.phone, message).catch(console.error);
                count++;
            }
            res.json({ count });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });
});
//# sourceMappingURL=notifyEnrolled.js.map