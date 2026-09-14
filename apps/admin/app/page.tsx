"use client";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { Card, Spinner } from "@lifeterrain/ui";

const LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/enrollments", label: "Enrollments" },
  { href: "/notifications", label: "Notifications" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/team", label: "Team" },
  { href: "/faqs", label: "FAQs" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/enquiries", label: "Enquiries" },
];

export default function AdminOverview() {
  const { loading } = useAdminGuard();
  if (loading) return <Spinner />;
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Overview</h1>
      <p className="mt-1 text-ink-500">Manage courses, enrollments, notifications and public site content from here.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            <Card className="p-5 transition-all hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm text-ink-500">Go to</p>
              <p className="font-display text-lg font-bold text-forest-700">{l.label} →</p>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
