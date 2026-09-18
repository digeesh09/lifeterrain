import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { enrollmentId, utrNumber } = await req.json();

    if (!enrollmentId || !utrNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    // Save to Firestore
    await adminDb.collection("enrollments").doc(enrollmentId).update({
      status: "pending_verification",
      utrNumber,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Manual pay submission failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
