import { SectionHeading } from "@lifeterrain/ui";

export const metadata = {
  title: "Refund & Cancellation Policy | LifeTerrain Research & Training",
};

export default function RefundPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Legal" title="Refund & Cancellation Policy" subtitle="Last updated: October 2023" />
      <div className="prose prose-forest mt-8 max-w-none text-ink-600">
        <h3>1. Cancellation by Participant</h3>
        <p>If you wish to cancel your enrollment in a course or workshop, you must notify us in writing via email at anoopecothoughts@gmail.com.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cancellations made <strong>7 days or more</strong> before the course start date will receive a 100% refund (minus payment gateway processing fees).</li>
          <li>Cancellations made <strong>within 7 days</strong> of the course start date are not eligible for a refund, but you may request to transfer your enrollment to a future batch.</li>
        </ul>

        <h3 className="mt-8">2. Cancellation by LifeTerrain</h3>
        <p>We reserve the right to cancel or reschedule a course due to low enrollment or other unforeseen circumstances. In such cases, you will be offered the choice of a full refund or transferring your enrollment to the rescheduled dates.</p>

        <h3 className="mt-8">3. Refund Processing</h3>
        <p>Approved refunds will be processed within 5-7 business days. The amount will be credited back to the original method of payment (via Razorpay).</p>
      </div>
    </div>
  );
}
