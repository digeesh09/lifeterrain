import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Send Email via Nodemailer (Database save is already handled securely by Client SDK)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password for Gmail
      },
    });

    let toEmail = "anoopecothoughts@gmail.com";
    
    // Attempt to fetch dynamic contact settings if Admin SDK is initialized
    if (adminDb) {
      try {
        const snap = await adminDb.collection("settings").doc("contact").get();
        if (snap.exists) {
          const data = snap.data();
          if (data?.email) toEmail = data.email;
        }
      } catch (e) {
        console.error("Failed to fetch contact settings", e);
      }
    }

    await transporter.sendMail({
      from: `"LifeTerrain" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `New Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Enquiry submission failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
