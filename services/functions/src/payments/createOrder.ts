import * as functions from "firebase-functions";
import Razorpay from "razorpay";
import cors from "cors";
import { db } from "../admin";

const corsHandler = cors({ origin: true });

const razorpay = new Razorpay({
  key_id: functions.config().razorpay?.key_id ?? process.env.RAZORPAY_KEY_ID!,
  key_secret: functions.config().razorpay?.key_secret ?? process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * POST { enrollmentId, amount }
 * Re-reads the enrollment's course fee server-side rather than trusting
 * the client-sent amount, then creates a Razorpay order for that value.
 */
export const createOrder = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { enrollmentId } = req.body;
      const enrollmentSnap = await db.collection("enrollments").doc(enrollmentId).get();
      if (!enrollmentSnap.exists) return res.status(404).json({ error: "Enrollment not found" });

      const enrollment = enrollmentSnap.data()!;
      const courseSnap = await db.collection("courses").doc(enrollment.courseSlug).get();
      const course = courseSnap.data();
      const activeFee =
        course?.earlyBirdFee && course?.earlyBirdDeadline && new Date() <= new Date(course.earlyBirdDeadline)
          ? course.earlyBirdFee
          : course?.fee ?? enrollment.amount;

      const order = await razorpay.orders.create({
        amount: Math.round(activeFee * 100),
        currency: "INR",
        receipt: enrollmentId,
        notes: { enrollmentId, courseSlug: enrollment.courseSlug },
      });

      res.json(order);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
});
