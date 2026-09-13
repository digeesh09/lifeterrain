import { Leaf, Users, Award, Globe2 } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading";
import { StaggerGroup, StaggerItem } from "../atoms/Reveal";

const ITEMS = [
  { icon: Leaf, title: "Practical, Applied Learning", desc: "Every course bridges international standards with hands-on, real-world project work — not just theory." },
  { icon: Users, title: "Expert-Led Sessions", desc: "Taught live by practicing researchers, policy experts and consultants active in the field today." },
  { icon: Award, title: "Recognised Certification", desc: "E-Certificates of Participation you can add to your CV, LinkedIn, and professional portfolio." },
  { icon: Globe2, title: "Open to Everyone, Everywhere", desc: "100% online, live & interactive — accessible to students, professionals and researchers across India and abroad." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-sage-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading eyebrow="Why LifeTerrain" title="Learn. Apply. Create Impact." subtitle="A learning experience designed around real careers in environment, sustainability and policy." />
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => (
            <StaggerItem key={it.title}>
              <div className="h-full rounded-xl2 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                  <it.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold text-forest-700">{it.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{it.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
