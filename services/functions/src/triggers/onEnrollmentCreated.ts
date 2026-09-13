import * as functions from "firebase-functions";
import { db } from "../admin";

/**
 * Housekeeping trigger: whenever a new enrollment doc is created, stamp a
 * denormalised course title/date onto it (in case the course changes
 * later) and decrement seatsLeft once the enrollment is confirmed.
 */
export const onEnrollmentWrite = functions.firestore
  .document("enrollments/{enrollmentId}")
  .onWrite(async (change) => {
    const before = change.before.exists ? change.before.data()! : null;
    const after = change.after.exists ? change.after.data()! : null;
    if (!after) return; // deleted

    const justConfirmed = after.status === "confirmed" && before?.status !== "confirmed";
    if (justConfirmed) {
      const courseRef = db.collection("courses").doc(after.courseSlug);
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(courseRef);
        if (!snap.exists) return;
        const seatsLeft = snap.data()?.seatsLeft;
        if (typeof seatsLeft === "number") tx.update(courseRef, { seatsLeft: Math.max(0, seatsLeft - 1) });
      });
    }
  });
