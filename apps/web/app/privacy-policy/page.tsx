import { SectionHeading } from "@lifeterrain/ui";

export const metadata = {
  title: "Privacy Policy | LifeTerrain Research & Training",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: October 2023" />
      <div className="prose prose-forest mt-8 max-w-none text-ink-600">
        <h3>1. Introduction</h3>
        <p>Welcome to LifeTerrain Research & Training. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        
        <h3>2. The Data We Collect About You</h3>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
          <li><strong>Financial Data</strong> includes bank account and payment card details (processed securely via Razorpay).</li>
          <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of courses you have purchased from us.</li>
        </ul>

        <h3 className="mt-8">3. How We Use Your Personal Data</h3>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., enrolling you in a course).</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal or regulatory obligation.</li>
        </ul>

        <h3 className="mt-8">4. Data Security</h3>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>

        <h3 className="mt-8">5. Contact Details</h3>
        <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
        <p className="mt-2">
          Email: anoopecothoughts@gmail.com<br/>
          Phone: +91 87147 29406<br/>
          Address: India
        </p>
      </div>
    </div>
  );
}
