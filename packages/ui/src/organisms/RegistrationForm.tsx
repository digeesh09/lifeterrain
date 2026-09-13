"use client";
import { FormEvent, useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import { Card } from "../atoms/Card";

export interface RegistrationValues {
  name: string;
  email: string;
  phone: string;
  qualification?: string;
  organisation: string;
  hearAbout?: string;
}

/**
 * Collects applicant details, then hands off to the parent's `onSubmit`,
 * which should create the enrollment record and kick off the Razorpay
 * checkout (see apps/web/lib/razorpay.ts).
 */
export function RegistrationForm({
  feeLabel,
  submitting,
  onSubmit,
}: {
  feeLabel: string;
  submitting?: boolean;
  onSubmit: (values: RegistrationValues) => void;
}) {
  const [values, setValues] = useState<RegistrationValues>({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    organisation: "",
    hearAbout: "",
  });

  const update = (k: keyof RegistrationValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Card className="mx-auto max-w-xl p-6 md:p-8">
      <h3 className="font-display text-xl font-bold text-forest-700">Register &amp; Pay to Enroll</h3>
      <p className="mt-1 text-sm text-ink-500">Course fee: <span className="font-semibold text-forest-700">{feeLabel}</span></p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormField label="Full Name" required>
          <Input required value={values.name} onChange={update("name")} placeholder="As per certificate" />
        </FormField>
        <FormField label="Email" required>
          <Input required type="email" value={values.email} onChange={update("email")} placeholder="you@example.com" />
        </FormField>
        <FormField label="Phone (WhatsApp enabled)" required>
          <Input required type="tel" value={values.phone} onChange={update("phone")} placeholder="+91 9XXXXXXXXX" />
        </FormField>
        <FormField label="Current Profession / Organisation / Institution" required>
          <Input required value={values.organisation} onChange={update("organisation")} />
        </FormField>
        <FormField label="Educational Qualification">
          <Input value={values.qualification} onChange={update("qualification")} />
        </FormField>
        <FormField label="How did you hear about this?">
          <Input value={values.hearAbout} onChange={update("hearAbout")} />
        </FormField>
        <Button type="submit" size="lg" loading={submitting} className="mt-2">
          Proceed to Payment
        </Button>
        <p className="text-center text-xs text-ink-500">
          Secure payment via Razorpay. You'll get an email &amp; WhatsApp confirmation instantly.
        </p>
      </form>
    </Card>
  );
}
