import { Hero, StatsBand, WhyChooseUs, AboutSplit, TeamSection, TestimonialSection, GalleryBand, FAQSection, CTABanner, WaveDivider, PartnerStrip, NewsletterBand, Reveal, SectionHeading, Button } from "@lifeterrain/ui";
import { listOpenCourses } from "@/lib/courses";
import { getLatestGalleryPhotos, getTestimonials, getTeamMembers, getFAQs } from "@/lib/content";
import CourseGridClient from "./courses/CourseGridClient";
import Link from "next/link";
import { subscribeToNewsletter } from "./actions";

export const revalidate = 60;

export const metadata = {
  title: "LifeTerrain | Bridging Scientific Research and Practice",
  description: "LifeTerrain provides high-quality environmental science, research training, and practical skills for credible environmental assessment.",
  openGraph: {
    title: "LifeTerrain | Bridging Scientific Research and Practice",
    description: "LifeTerrain provides high-quality environmental science, research training, and practical skills for credible environmental assessment.",
    type: "website",
  }
};

const STATS = [
  { value: 3, label: "Live Programmes Launched" },
  { value: 10, label: "Days of Practical Training" },
  { value: 100, suffix: "%", label: "Online & Interactive" },
  { value: 2, label: "Expert Resource Persons" },
];

export default async function HomePage() {
  const [courses, latestPhotos, testimonials, team, faqs] = await Promise.all([
    listOpenCourses().catch(() => []),
    getLatestGalleryPhotos(4),
    getTestimonials(),
    getTeamMembers(),
    getFAQs(),
  ]);

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
      
      <div className="bg-sage-50">
        <WaveDivider fill="#ffffff" />
      </div>

      <Reveal>
        <CourseGridClient courses={courses} />
      </Reveal>

      <div className="bg-sage-50">
        <WaveDivider fill="#ffffff" flip />
        <Reveal>
          <TeamSection members={team} />
        </Reveal>
        <WaveDivider fill="#ffffff" />
      </div>

      <Reveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading
            eyebrow="Latest from the Gallery"
            title="Moments from Our Programmes"
            subtitle="A peek at recent workshops, fieldwork and team sessions — see the full collection in our gallery."
          />
          <GalleryBand images={latestPhotos.map((p) => ({ url: p.url, alt: p.alt }))} />
          <div className="mt-8 text-center">
            <Link href="/gallery">
              <Button variant="outline">View Full Gallery →</Button>
            </Link>
          </div>
        </section>
      </Reveal>

      <PartnerStrip names={["ISO 14064-2", "Paris Agreement · Article 6", "Verra Carbon Standard", "India CCTS"]} title="Frameworks We Train On" />

      <Reveal>
        <TestimonialSection items={testimonials} />
      </Reveal>

      <Reveal>
        <FAQSection items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      </Reveal>

      <NewsletterBand onSubscribe={subscribeToNewsletter} />

      <Reveal>
        <CTABanner />
      </Reveal>
    </>
  );
}
