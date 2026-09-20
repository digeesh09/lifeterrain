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
exports.verifyPayment = void 0;
const functions = __importStar(require("firebase-functions"));
const crypto = __importStar(require("crypto"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = require("../admin");
const sendEmail_1 = require("../notifications/sendEmail");
const sendWhatsApp_1 = require("../notifications/sendWhatsApp");
const corsHandler = (0, cors_1.default)({ origin: true });
/**
 * POST { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId }
 * Verifies the HMAC signature Razorpay returns, then marks the enrollment
 * confirmed and fires the confirmation email + WhatsApp message.
 * This is the only place enrollment status is allowed to become
 * "confirmed" — Firestore rules block clients from writing that field.
 */
exports.verifyPayment = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;
            const secret = functions.config().razorpay?.key_secret ?? process.env.RAZORPAY_KEY_SECRET;
            const expected = crypto
                .createHmac("sha256", secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest("hex");
            const verified = expected === razorpay_signature;
            if (!verified)
                return res.status(400).json({ verified: false });
            const enrollmentRef = admin_1.db.collection("enrollments").doc(enrollmentId);
            await enrollmentRef.update({
                status: "confirmed",
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                confirmedAt: admin_1.admin.firestore.FieldValue.serverTimestamp(),
            });
            const enrollment = (await enrollmentRef.get()).data();
            await (0, sendEmail_1.sendEnrollmentConfirmation)(enrollment).catch((e) => console.error("email failed", e));
            await (0, sendWhatsApp_1.sendWhatsAppMessage)(enrollment.phone, `Hi ${enrollment.name}, your enrollment for "${enrollment.courseTitle}" is confirmed! We'll send session reminders here. — LifeTerrain Research & Training`).catch((e) => console.error("whatsapp failed", e));
            res.json({ verified: true });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ verified: false, error: err.message });
        }
    });
});
//# sourceMappingURL=verifyPayment.js.map