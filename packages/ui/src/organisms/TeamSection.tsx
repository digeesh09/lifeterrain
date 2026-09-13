import Image from "next/image";
import { SectionHeading } from "../molecules/SectionHeading";

export interface TeamMember { name: string; role: string; bio: string; photoUrl: string; }

export function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Meet the Team" title="Resource Persons & Faculty" subtitle="Practicing researchers and policy experts who lead every session." />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.name} className="text-center">
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full shadow-card ring-4 ring-white">
              <Image src={m.photoUrl} alt={m.name} fill className="object-cover" sizes="128px" />
            </div>
            <h3 className="mt-4 font-display font-bold text-forest-700">{m.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-leaf-600">{m.role}</p>
            <p className="mt-2 text-sm text-ink-500">{m.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
