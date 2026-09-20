import * as functions from "firebase-functions";
import nodemailer from "nodemailer";

const port = Number(functions.config().smtp?.port ?? process.env.SMTP_PORT ?? 587);
const user = functions.config().smtp?.user ?? process.env.SMTP_USER;

const transporter = nodemailer.createTransport({
  host: functions.config().smtp?.host ?? process.env.SMTP_HOST,
  port: port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user: user,
    pass: functions.config().smtp?.pass ?? process.env.SMTP_PASS,
  },
});

const FROM = `"LifeTerrain Research & Training" <${user ?? "no-reply@lifeterrain.in"}>`;

export async function sendEnrollmentConfirmation(enrollment: { name: string; email: string; courseTitle: string; amount: number }) {
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

export async function sendReminderEmail(to: string, name: string, courseTitle: string, when: string, meetingLink?: string) {
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

export async function sendCustomEmail(to: string, name: string, courseTitle: string, message: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Update: ${courseTitle}`,
    html: `<div style="font-family:sans-serif;color:#1b2a3a"><p>Hi ${name},</p><p>${message}</p><p>— Team LifeTerrain</p></div>`,
  });
}
