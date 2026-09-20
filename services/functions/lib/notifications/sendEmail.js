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
exports.sendEnrollmentConfirmation = sendEnrollmentConfirmation;
exports.sendReminderEmail = sendReminderEmail;
exports.sendCustomEmail = sendCustomEmail;
const functions = __importStar(require("firebase-functions"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: functions.config().smtp?.host ?? process.env.SMTP_HOST,
    port: Number(functions.config().smtp?.port ?? process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
        user: functions.config().smtp?.user ?? process.env.SMTP_USER,
        pass: functions.config().smtp?.pass ?? process.env.SMTP_PASS,
    },
});
const FROM = '"LifeTerrain Research & Training" <no-reply@lifeterrain.in>';
async function sendEnrollmentConfirmation(enrollment) {
    await transporter.sendMail({
        from: FROM,
        to: enrollment.email,
        subject: `Enrollment Confirmed: ${enrollment.courseTitle}`,
        html: `
      <div style="font-family:sans-serif;color:#1b2a3a">
        <div style="background:#123b26;padding:20px;color:#fff;border-radius:8px 8px 0 0">
          <h2 style="margin:0">LifeTerrain Research &amp; Training</h2>
        </div>
        <div style="padding:20px;border:1px solid #eee;border-top:none">
          <p>Hi ${enrollment.name},</p>
          <p>Your enrollment for <strong>${enrollment.courseTitle}</strong> is confirmed. Payment of ₹${enrollment.amount} received.</p>
          <p>You'll get session reminders by email &amp; WhatsApp as the dates approach.</p>
          <p>See you there!<br/>Team LifeTerrain</p>
        </div>
      </div>`,
    });
}
async function sendReminderEmail(to, name, courseTitle, when, meetingLink) {
    await transporter.sendMail({
        from: FROM,
        to,
        subject: `Reminder: ${courseTitle} — ${when}`,
        html: `
      <div style="font-family:sans-serif;color:#1b2a3a">
        <p>Hi ${name},</p>
        <p>This is a reminder that your session for <strong>${courseTitle}</strong> is coming up: <strong>${when}</strong>.</p>
        ${meetingLink ? `<p>Join here: <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
        <p>— Team LifeTerrain</p>
      </div>`,
    });
}
async function sendCustomEmail(to, name, courseTitle, message) {
    await transporter.sendMail({
        from: FROM,
        to,
        subject: `Update: ${courseTitle}`,
        html: `<div style="font-family:sans-serif;color:#1b2a3a"><p>Hi ${name},</p><p>${message}</p><p>— Team LifeTerrain</p></div>`,
    });
}
//# sourceMappingURL=sendEmail.js.map