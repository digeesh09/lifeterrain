import { AboutSplit, TeamSection, StatsBand, CTABanner, SectionHeading, Reveal, StaggerGroup, StaggerItem, WaveDivider } from "@lifeterrain/ui";
import { Leaf, GraduationCap, Building2, Globe2, Sprout } from "lucide-react";
import { getTeamMembers, getStats } from "@/lib/content";

export const revalidate = 10;

export const metadata = {
  title: "About Us | LifeTerrain",
  description: "Learn about LifeTerrain's mission to promote interdisciplinary studies, capacity building, and innovative environmental solutions.",
};

const FOCUS_AREAS = [
  { icon: Leaf, title: "Research & Scientific Development", desc: "Promoting interdisciplinary studies, research collaborations, and innovative solutions across life sciences, environmental studies, ecology, wildlife and biodiversity." },
  { icon: GraduationCap, title: "Training & Capacity Building", desc: "Specialised training programmes, professional courses, workshops, seminars and expert-led sessions to strengthen scientific and technical competence." },
  { icon: Building2, title: "Industry & Corporate Applications", desc: "Bridging the gap between scientific research and industry by translating research outcomes into practical industrial and corporate applications." },
  { icon: Sprout, title: "Environmental & Sustainability Initiatives", desc: "Promoting scientific approaches to environmental awareness, biodiversity conservation, sustainability and responsible decision-making." },
  { icon: Globe2, title: "Knowledge Exchange & Collaboration", desc: "Creating platforms for interaction among researchers, academic institutions, industries, professionals and experts." },
];

export default async function AboutPage() {
  const [team, stats] = await Promise.all([
    getTeamMembers(),
    getStats()
  ]);

  return (
    <>
      <div className="bg-forest-700 py-16 text-center text-white">
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">People · Knowledge · A Sustainable Tomorrow</h1>
        <p className="mx-auto mt-3 max-w-2xl text-cream/80">
          LifeTerrain Research &amp; Training (India) connects scientific research, knowledge and
          real-world application to build a more sustainable tomorrow.
        </p>
      </div>

      <StatsBand stats={stats} />

      <AboutSplit
        eyebrow="What We Do"
        title="From Scientific Research to Real-World Practice"
        imageUrl="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=70"
        imageAlt="Tall trees in a green forest"
      >
        <p>
          We connect scientific research, knowledge, training, and real-world applications to create
          meaningful learning and professional development opportunities. Our programmes support
          students, researchers, academicians and professionals through learning that enhances
          academic excellence, employability and interdisciplinary understanding.
        </p>
      </AboutSplit>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading eyebrow="Our Focus Areas" title="How We Work" />
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_AREAS.map((f) => (
            <StaggerItem key={f.title}>
              <div className="h-full rounded-xl2 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold text-forest-700">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <div className="bg-sage-50">
        <WaveDivider fill="#ffffff" flip />
        <Reveal>
          <TeamSection members={team} />
        </Reveal>
        <WaveDivider fill="#ffffff" />
      </div>
      <Reveal>
        <CTABanner />
      </Reveal>
    </>
  );
}
