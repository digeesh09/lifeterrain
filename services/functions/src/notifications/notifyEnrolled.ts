import * as functions from "firebase-functions";
import cors from "cors";
import { db, admin } from "../admin";
import { sendCustomEmail } from "./sendEmail";
import { sendWhatsAppMessage } from "./sendWhatsApp";

const corsHandler = cors({ origin: true });

/**
 * Admin-only broadcast endpoint used by apps/admin's Notifications page.
 * Verifies the caller's Firebase ID token carries the `admin` custom claim
 * before sending anything.
 */
export const notifyEnrolled = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const authHeader = req.headers.authorization ?? "";
      const idToken = authHeader.replace("Bearer ", "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!decoded.admin) return res.status(403).json({ error: "Admin access required" });

      const { courseSlug, channel, message } = req.body;
      const enrollmentsSnap = await db
        .collection("enrollments")
        .where("courseSlug", "==", courseSlug)
        .where("status", "==", "confirmed")
        .get();

      let count = 0;
      for (const doc of enrollmentsSnap.docs) {
        const e = doc.data();
        if (channel !== "whatsapp") await sendCustomEmail(e.email, e.name, e.courseTitle, message).catch(console.error);
        if (channel !== "email") await sendWhatsAppMessage(e.phone, message).catch(console.error);
        count++;
      }

      res.json({ count });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
});
