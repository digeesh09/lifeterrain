import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb } from "@/lib/firebase-admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock123",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function POST(req: Request) {
  try {
    const { enrollmentId } = await req.json();

    if (!enrollmentId) {
      return NextResponse.json({ error: "Missing enrollmentId" }, { status: 400 });
    }

    // Securely fetch the pending enrollment fee from Firestore
    // Note: We use Admin SDK because the client just created this document but it's not strictly necessary.
    // The amount is saved when the pending enrollment is created by the user.
    if (!adminDb) return NextResponse.json({ error: "Admin DB not initialized" }, { status: 500 });
    
    const enrollmentSnap = await adminDb.collection("enrollments").doc(enrollmentId).get();
    
    if (!enrollmentSnap.exists) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const enrollmentData = enrollmentSnap.data();
    const feeInRupees = enrollmentData?.amount || 0;
    
    if (feeInRupees <= 0) {
      return NextResponse.json({ error: "Invalid course fee" }, { status: 400 });
    }

    // Razorpay amount is in paise (multiply by 100)
    const options = {
      amount: feeInRupees * 100,
      currency: "INR",
      receipt: `receipt_${enrollmentId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
