import { Hero, StatsBand, WhyChooseUs, AboutSplit, TeamSection, TestimonialSection, GalleryBand, FAQSection, CTABanner, WaveDivider, PartnerStrip, NewsletterBand, Reveal, SectionHeading } from "@lifeterrain/ui";
import { listOpenCourses } from "@/lib/courses";
import { getLatestGalleryPhotos } from "@/lib/gallery";
import CourseGridClient from "./courses/CourseGridClient";
import { subscribeToNewsletter } from "./actions";
import Link from "next/link";

export const revalidate = 60;

const STATS = [
  { value: 3, label: "Live Programmes Launched" },
  { value: 10, label: "Days of Practical Training" },
  { value: 100, suffix: "%", label: "Online & Interactive" },
  { value: 2, label: "Expert Resource Persons" },
];

const TEAM = [
  {
    name: "Dr. Anoop V.",
    role: "Environmental Researcher, Trainer & Founder",
    bio: "Founder of LifeTerrain Research and Training, leading course design and delivery across GHG accounting, carbon markets and environmental impact assessment.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=70",
  },
  {
    name: "Somnath Banerjee",
    role: "Environmental Policy Expert, Researcher & Consultant",
    bio: "Brings policy and regulatory depth to our carbon markets and sustainability programmes, consulting across compliance and voluntary carbon schemes.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=70",
  },
];

const TESTIMONIALS = [
  { quote: "The GHG accounting sessions were extremely practical — I could apply the ISO 14064-2 framework to my own project the same week.", name: "Environmental Consultant", role: "EIA Workshop Participant" },
  { quote: "Clear, structured, and taught by people who actually work in this space. The carbon markets module demystified Article 6 for me.", name: "Research Scholar", role: "Carbon Credit Mechanisms Batch" },
  { quote: "Best online format I've attended — live, interactive, and the resource persons stayed back to answer every question.", name: "Sustainability Officer", role: "Master Class Alumnus" },
];

const FAQS = [
  { q: "Are these courses live or pre-recorded?", a: "All sessions are 100% online, live and interactive — you can ask questions in real time. Recordings are usually shared with enrolled participants afterward." },
  { q: "Will I get a certificate?", a: "Yes, every course includes an E-Certificate of Participation on successful completion." },
  { q: "How do I pay the course fee?", a: "Registration and payment happen together on our site via Razorpay — cards, UPI, netbanking and wallets are all supported." },
  { q: "I registered but haven't received a confirmation — what do I do?", a: "Check your dashboard after logging in; if payment succeeded but you don't see a confirmation email/WhatsApp within a few minutes, contact us at anoopecothoughts@gmail.com or +91 87147 29406." },
];

export default async function HomePage() {
  const courses = await listOpenCourses().catch(() => []);
  const latestPhotos = getLatestGalleryPhotos(4);

  return (
    <>
      <Hero />
      <StatsBand stats={STATS} />

      <Reveal>
        <AboutSplit
          eyebrow="About LifeTerrain"
          title="Connecting Research, Knowledge & Real-World Impact"
          imageUrl="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=70"
          imageAlt="Sunbeams through a green forest"
        >
          <p>
            At LifeTerrain Research and Training, we connect scientific research, knowledge, training,
            and real-world applications to create meaningful learning and professional development
            opportunities — across environment, ecology, wildlife, biodiversity and allied fields.
          </p>
          <p>
            We conduct specialised training programmes, professional courses, workshops, seminars and
            expert-led sessions designed to strengthen scientific knowledge, research skills, technical
            competence and practical capabilities — while bridging the gap between research and industry.
          </p>
        </AboutSplit>
      </Reveal>

      <Reveal>
        <WhyChooseUs />
      </Reveal>

      <WaveDivider fill="#ffffff" />
      <Reveal>
        <CourseGridClient courses={courses} />
      </Reveal>

      <Reveal>
        <TeamSection members={TEAM} />
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading
            eyebrow="Latest from the Gallery"
            title="Moments from Our Programmes"
            subtitle="A peek at recent workshops, fieldwork and team sessions — see the full collection in our gallery."
          />
          <GalleryBand images={latestPhotos.map((p) => ({ url: p.url, alt: p.alt }))} />
          <div className="mt-8 text-center">
            <Link href="/gallery" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-forest-700 px-5 py-2.5 text-base font-display font-semibold text-forest-700 transition-colors hover:bg-forest-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500">
              View Full Gallery →
            </Link>
          </div>
        </section>
      </Reveal>

      <PartnerStrip names={["ISO 14064-2", "Paris Agreement · Article 6", "Verra Carbon Standard", "India CCTS"]} title="Frameworks We Train On" />

      <Reveal>
        <TestimonialSection items={TESTIMONIALS} />
      </Reveal>

      <Reveal>
        <FAQSection items={FAQS} />
      </Reveal>

      <NewsletterBand onSubscribe={subscribeToNewsletter} />

      <Reveal>
        <CTABanner />
      </Reveal>
    </>
  );
}
