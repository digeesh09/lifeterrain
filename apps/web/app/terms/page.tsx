import { SectionHeading } from "@lifeterrain/ui";

export const metadata = {
  title: "Terms and Conditions | LifeTerrain Research & Training",
};

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Legal" title="Terms & Conditions" subtitle="Last updated: October 2023" />
      <div className="prose prose-forest mt-8 max-w-none text-ink-600">
        <h3>1. Agreement to Terms</h3>
        <p>By accessing our website at lifeterrain.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        
        <h3 className="mt-8">2. Educational Services</h3>
        <p>LifeTerrain provides environmental science and research training. Course content, materials, and certificates are provided for educational purposes. We reserve the right to modify course structures and syllabus to keep content up-to-date with the latest scientific developments.</p>

        <h3 className="mt-8">3. User Accounts</h3>
        <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

        <h3 className="mt-8">4. Payments</h3>
        <p>All course fees are collected securely via our payment gateway (Razorpay). Access to courses is granted upon successful realization of payment.</p>

        <h3 className="mt-8">5. Governing Law</h3>
        <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
      </div>
    </div>
  );
}
