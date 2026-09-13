"use client";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { Card, Spinner } from "@lifeterrain/ui";

export default function AdminOverview() {
  const { loading } = useAdminGuard();
  if (loading) return <Spinner />;
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Overview</h1>
      <p className="mt-1 text-ink-500">Manage courses, enrollments and notifications from here.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-ink-500">Go to</p><p className="font-display text-lg font-bold text-forest-700">Courses →</p></Card>
        <Card className="p-5"><p className="text-sm text-ink-500">Go to</p><p className="font-display text-lg font-bold text-forest-700">Enrollments →</p></Card>
        <Card className="p-5"><p className="text-sm text-ink-500">Go to</p><p className="font-display text-lg font-bold text-forest-700">Notifications →</p></Card>
      </div>
    </div>
  );
}
