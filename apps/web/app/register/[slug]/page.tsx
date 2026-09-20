"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RegistrationForm, RegistrationValues, Spinner } from "@lifeterrain/ui";
import { getCourseBySlug, CourseDoc } from "@/lib/courses";
import { payForEnrollment } from "@/lib/razorpay";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function RegisterPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDoc | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getCourseBySlug(slug).then(setCourse);
    
    import("firebase/firestore").then(({ doc, getDoc }) => {
      getDoc(doc(db, "settings", "payment")).then(snap => {
        setPaymentSettings(snap.exists() ? snap.data() : { mode: "razorpay" });
      });
      
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setIsLoggedIn(true);
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) setUserProfile(userSnap.data());
          } else {
            setIsLoggedIn(false);
          }
        });
      });
    });
  }, [slug]);

  if (!course || !paymentSettings || isLoggedIn === null) return <div className="flex justify-center py-24"><Spinner /></div>;

  if (isLoggedIn === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
        <h1 className="mb-4 font-display text-3xl font-extrabold text-forest-700">Login Required</h1>
        <p className="mb-8 text-lg text-ink-600">Please login or create an account to enroll in <b>{course.title}</b>.</p>
        <button
          onClick={() => router.push(`/login`)}
          className="rounded-lg bg-leaf-500 px-8 py-3 font-bold text-white hover:bg-leaf-600 transition-colors"
        >
          Login / Register
        </button>
      </div>
    );
  }

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

      // 2. Launch Razorpay or redirect to manual payment
      if (paymentSettings?.mode === "manual") {
        router.push(`/register/${course!.slug}/manual-pay?id=${enrollmentRef.id}`);
      } else {
        await payForEnrollment({
          enrollmentId: enrollmentRef.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          onSuccess: async (paymentId) => {
            // The verification API route already marks the enrollment as "confirmed" securely.
            router.push(`/dashboard?enrolled=${course!.slug}`);
          },
          onFailure: (reason) => setError(reason),
        });
      }
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
      <RegistrationForm
        feeLabel={`₹${activeFee}`}
        submitting={submitting}
        onSubmit={handleSubmit}
        initialValues={{
          name: userProfile?.name || "",
          email: userProfile?.email || "",
          phone: userProfile?.phone || "",
          organisation: userProfile?.institution || "",
        }}
      />
    </div>
  );
}
