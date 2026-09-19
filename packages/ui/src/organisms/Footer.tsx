import { Mail, Phone, MapPin } from "lucide-react";

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export function Footer({ contact = { email: "anoopecothoughts@gmail.com", phone: "+91 87147 29406", address: "India" } }: { contact?: ContactInfo | null }) {
  return (
    <footer className="bg-forest-900 text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-3 font-display text-lg font-extrabold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="LifeTerrain" className="h-10 w-auto object-contain rounded-md" />
            <span>LifeTerrain <span className="block text-sm font-medium text-leaf-400">Research &amp; Training</span></span>
          </div>
          <p className="mt-4 text-sm text-cream/70">
            People · Knowledge · A Sustainable Tomorrow. Bridging scientific research, training and
            real-world environmental practice.
          </p>
        </div>
        <div className="text-sm text-cream/80">
          <h4 className="mb-3 font-display font-bold text-leaf-500">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/courses" className="hover:text-white">Courses &amp; Workshops</a></li>
            <li><a href="/gallery" className="hover:text-white">Gallery</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/dashboard" className="hover:text-white">My Enrollments</a></li>
          </ul>
        </div>
        <div className="text-sm text-cream/80">
          <h4 className="mb-3 font-display font-bold text-leaf-500">Legal & Policies</h4>
          <ul className="space-y-2">
            <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms &amp; Conditions</a></li>
            <li><a href="/refund" className="hover:text-white">Refund Policy</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        <div className="text-sm text-cream/80">
          <h4 className="mb-3 font-display font-bold text-leaf-500">Reach Us</h4>
          <ul className="space-y-2">
            {contact === null ? (
              <>
                <li className="h-5 w-48 rounded bg-white/10 animate-pulse"></li>
                <li className="h-5 w-40 rounded bg-white/10 animate-pulse"></li>
                <li className="h-5 w-56 rounded bg-white/10 animate-pulse"></li>
              </>
            ) : (
              <>
                {contact?.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {contact.email}</li>}
                {contact?.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {contact.phone}</li>}
                {contact?.address && <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {contact.address}</li>}
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} LifeTerrain Research &amp; Training. All rights reserved. · Smaller Footprints, Brighter Futures.
      </div>
    </footer>
  );
}
