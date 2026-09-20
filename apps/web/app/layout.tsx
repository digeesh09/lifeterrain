import type { Metadata } from "next";
import "./globals.css";
import { SiteNavbar } from "@/components/SiteNavbar";
import NextTopLoader from 'nextjs-toploader';
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "LifeTerrain Research & Training",
  description: "Practical courses, workshops and expert-led training in environment, biodiversity and sustainability.",
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-body text-ink-900 antialiased">
        <NextTopLoader color="#034e35" showSpinner={false} />
        <SiteNavbar links={NAV_LINKS} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
