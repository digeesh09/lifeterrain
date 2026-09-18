import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";

    // Verify Signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Admin DB not initialized" }, { status: 500 });
    }

    // Update Enrollment Status to Confirmed using Admin SDK (bypasses security rules)
    await adminDb.collection("enrollments").doc(enrollmentId).update({
      status: "confirmed",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      updatedAt: new Date(),
    });

    const enrollmentDoc = await adminDb.collection("enrollments").doc(enrollmentId).get();
    const enrollmentData = enrollmentDoc.data();

    if (enrollmentData && enrollmentData.email) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"LifeTerrain" <${process.env.SMTP_USER}>`,
        to: enrollmentData.email,
        subject: `Enrollment Confirmed: ${enrollmentData.courseTitle}`,
        text: `Dear ${enrollmentData.name},\n\nYour payment was successful and your enrollment for "${enrollmentData.courseTitle}" is confirmed.\n\nThank you,\nLifeTerrain Research & Training`,
      }).catch((e: any) => console.error("Failed to send receipt email:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
