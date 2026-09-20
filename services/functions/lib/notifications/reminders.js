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
exports.dailyCourseReminders = void 0;
const functions = __importStar(require("firebase-functions"));
const admin_1 = require("../admin");
const sendEmail_1 = require("./sendEmail");
const sendWhatsApp_1 = require("./sendWhatsApp");
/**
 * Runs once a day. Finds courses starting tomorrow (or with a session the
 * next day, if you extend the schema with per-day sessions) and reminds
 * every confirmed enrollee by email + WhatsApp.
 */
exports.dailyCourseReminders = functions.pubsub
    .schedule("every day 09:00")
    .timeZone("Asia/Kolkata")
    .onRun(async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    const coursesSnap = await admin_1.db
        .collection("courses")
        .where("startDateISO", ">=", `${tomorrowStr}T00:00:00.000Z`)
        .where("startDateISO", "<=", `${tomorrowStr}T23:59:59.999Z`)
        .get();
    for (const courseDoc of coursesSnap.docs) {
        const course = courseDoc.data();
        const enrollmentsSnap = await admin_1.db
            .collection("enrollments")
            .where("courseSlug", "==", courseDoc.id)
            .where("status", "==", "confirmed")
            .get();
        for (const enrollmentDoc of enrollmentsSnap.docs) {
            const e = enrollmentDoc.data();
            const when = `${course.startDate}${course.time ? " · " + course.time : ""}`;
            await (0, sendEmail_1.sendReminderEmail)(e.email, e.name, course.title, when, course.meetingLink).catch(console.error);
            await (0, sendWhatsApp_1.sendWhatsAppMessage)(e.phone, `Reminder: "${course.title}" starts tomorrow (${when}). ${course.meetingLink ? "Link: " + course.meetingLink : "Details in your email."} — LifeTerrain`).catch(console.error);
        }
    }
    console.log(`Reminders processed for ${coursesSnap.size} course(s) starting ${tomorrowStr}`);
    return null;
});
//# sourceMappingURL=reminders.js.map