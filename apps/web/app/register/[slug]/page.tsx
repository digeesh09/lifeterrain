"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RegistrationForm, RegistrationValues, Spinner } from "@lifeterrain/ui";
import { getCourseBySlug, CourseDoc } from "@/lib/courses";
import { payForEnrollment } from "@/lib/razorpay";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegisterPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDoc | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourseBySlug(slug).then(setCourse);
  }, [slug]);

  if (!course) return <div className="flex justify-center py-24"><Spinner /></div>;

  const activeFee =
    course.earlyBirdFee && course.earlyBirdDeadline && new Date() <= new Date(course.earlyBirdDeadline)
      ? course.earlyBirdFee
      : course.fee;

  async function handleSubmit(values: RegistrationValues) {
    setSubmitting(true);
    setError(null);
    try {
      // 1. Create a pending enrollment record first — this is what the
      //    Cloud Function verifies the payment against.
      const enrollmentRef = await addDoc(collection(db, "enrollments"), {
        ...values,
        courseSlug: course!.slug,
        courseTitle: course!.title,
        amount: activeFee,
        status: "pending_payment",
        createdAt: serverTimestamp(),
      });

      // 2. Launch Razorpay checkout for that enrollment.
      await payForEnrollment({
        enrollmentId: enrollmentRef.id,
        amountInPaise: activeFee * 100,
        name: values.name,
        email: values.email,
        phone: values.phone,
        onSuccess: async (paymentId) => {
          await updateDoc(doc(db, "enrollments", enrollmentRef.id), {
            status: "confirmed",
            paymentId,
            confirmedAt: serverTimestamp(),
          });
          router.push(`/dashboard?enrolled=${course!.slug}`);
        },
        onFailure: (reason) => setError(reason),
      });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <h1 className="mb-2 font-display text-2xl font-extrabold text-forest-700">{course.title}</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <RegistrationForm feeLabel={`₹${activeFee}`} submitting={submitting} onSubmit={handleSubmit} />
    </div>
  );
}
