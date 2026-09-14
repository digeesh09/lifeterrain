import * as functions from "firebase-functions";
import * as crypto from "crypto";
import cors from "cors";
import { db, admin } from "../admin";
import { sendEnrollmentConfirmation } from "../notifications/sendEmail";
import { sendWhatsAppMessage } from "../notifications/sendWhatsApp";

type Enrollment = {
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  amount: number;
};

const corsHandler = cors({ origin: true });

/**
 * POST { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId }
 * Verifies the HMAC signature Razorpay returns, then marks the enrollment
 * confirmed and fires the confirmation email + WhatsApp message.
 * This is the only place enrollment status is allowed to become
 * "confirmed" — Firestore rules block clients from writing that field.
 */
export const verifyPayment = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;
      const secret = functions.config().razorpay?.key_secret ?? process.env.RAZORPAY_KEY_SECRET!;

      const expected = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const verified = expected === razorpay_signature;
      if (!verified) return res.status(400).json({ verified: false });

      const enrollmentRef = db.collection("enrollments").doc(enrollmentId);
      await enrollmentRef.update({
        status: "confirmed",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      const enrollment = (await enrollmentRef.get()).data() as Enrollment;
      await sendEnrollmentConfirmation(enrollment).catch((e) => console.error("email failed", e));
      await sendWhatsAppMessage(
        enrollment.phone,
        `Hi ${enrollment.name}, your enrollment for "${enrollment.courseTitle}" is confirmed! We'll send session reminders here. — LifeTerrain Research & Training`
      ).catch((e) => console.error("whatsapp failed", e));

      res.json({ verified: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ verified: false, error: err.message });
    }
  });
});
