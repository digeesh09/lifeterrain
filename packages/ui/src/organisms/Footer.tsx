import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <Leaf className="h-5 w-5 text-leaf-500" /> LifeTerrain Research &amp; Training
          </div>
          <p className="mt-3 text-sm text-cream/70">
            People · Knowledge · A Sustainable Tomorrow. Bridging scientific research, training and
            real-world environmental practice.
          </p>
        </div>
        <div className="text-sm text-cream/80">
          <h4 className="mb-3 font-display font-bold text-leaf-500">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/courses" className="hover:text-white">Courses &amp; Workshops</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/dashboard" className="hover:text-white">My Enrollments</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm text-cream/80">
          <h4 className="mb-3 font-display font-bold text-leaf-500">Reach Us</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> anoopecothoughts@gmail.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 87147 29406</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} LifeTerrain Research &amp; Training. All rights reserved. · Smaller Footprints, Brighter Futures.
      </div>
    </footer>
  );
}
