// Loads the Razorpay Checkout script once and opens the payment modal.
// The actual order is created server-side by the `createOrder` Cloud
// Function so the amount can never be tampered with on the client.

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function payForEnrollment({
  enrollmentId,
  name,
  email,
  phone,
  onSuccess,
  onFailure,
}: {
  enrollmentId: string;
  name: string;
  email: string;
  phone: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (reason: string) => void;
}) {
  const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!ok) return onFailure("Could not load Razorpay checkout");

  const orderRes = await fetch(`/api/razorpay/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrollmentId }),
  });
  const order = await orderRes.json();
  if (!order?.id) return onFailure("Could not create payment order");

  const rzp = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    name: "LifeTerrain Research & Training",
    description: "Course Enrollment Fee",
    order_id: order.id,
    prefill: { name, email, contact: phone },
    theme: { color: "#123b26" },
    handler: async (response: any) => {
      const verifyRes = await fetch(`/api/razorpay/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, enrollmentId }),
      });
      const result = await verifyRes.json();
      if (result?.success) onSuccess(response.razorpay_payment_id);
      else onFailure("Payment verification failed");
    },
    modal: { ondismiss: () => onFailure("Payment cancelled") },
  });
  rzp.open();
}
