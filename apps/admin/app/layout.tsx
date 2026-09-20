import "./globals.css";
import type { Metadata } from "next";
import { AdminNavigation } from "@/components/AdminNavigation";

import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = { title: "LifeTerrain Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-body text-ink-900 antialiased">
        <NextTopLoader color="#4ade80" showSpinner={false} />
        <div className="flex min-h-screen">
          <AdminNavigation />
          <main className="flex-1 p-6 md:p-10 pt-16 md:pt-10 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
