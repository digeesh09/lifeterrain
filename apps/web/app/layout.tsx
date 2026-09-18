import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@lifeterrain/ui";
import { SiteNavbar } from "@/components/SiteNavbar";

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
      <body className="font-body text-ink-900 antialiased">
        <SiteNavbar links={NAV_LINKS} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
