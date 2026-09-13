import * as functions from "firebase-functions";
import { db } from "../admin";
import { sendReminderEmail } from "./sendEmail";
import { sendWhatsAppMessage } from "./sendWhatsApp";

/**
 * Runs once a day. Finds courses starting tomorrow (or with a session the
 * next day, if you extend the schema with per-day sessions) and reminds
 * every confirmed enrollee by email + WhatsApp.
 */
export const dailyCourseReminders = functions.pubsub
  .schedule("every day 09:00")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const coursesSnap = await db
      .collection("courses")
      .where("startDateISO", ">=", `${tomorrowStr}T00:00:00.000Z`)
      .where("startDateISO", "<=", `${tomorrowStr}T23:59:59.999Z`)
      .get();

    for (const courseDoc of coursesSnap.docs) {
      const course = courseDoc.data();
      const enrollmentsSnap = await db
        .collection("enrollments")
        .where("courseSlug", "==", courseDoc.id)
        .where("status", "==", "confirmed")
        .get();

      for (const enrollmentDoc of enrollmentsSnap.docs) {
        const e = enrollmentDoc.data();
        const when = `${course.startDate}${course.time ? " · " + course.time : ""}`;
        await sendReminderEmail(e.email, e.name, course.title, when, course.meetingLink).catch(console.error);
        await sendWhatsAppMessage(
          e.phone,
          `Reminder: "${course.title}" starts tomorrow (${when}). ${course.meetingLink ? "Link: " + course.meetingLink : "Details in your email."} — LifeTerrain`
        ).catch(console.error);
      }
    }

    console.log(`Reminders processed for ${coursesSnap.size} course(s) starting ${tomorrowStr}`);
    return null;
  });
