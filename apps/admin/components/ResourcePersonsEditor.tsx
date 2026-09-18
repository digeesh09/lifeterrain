import { Button, Input } from "@lifeterrain/ui";
import { ChangeEvent } from "react";

export interface ResourcePerson {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

export function ResourcePersonsEditor({
  value,
  onChange,
}: {
  value: ResourcePerson[];
  onChange: (v: ResourcePerson[]) => void;
}) {
  const persons = value || [];

  const addPerson = () => onChange([...persons, { name: "", role: "", bio: "", imageUrl: "" }]);
  const updatePerson = (index: number, partial: Partial<ResourcePerson>) => {
    const newPersons = [...persons];
    newPersons[index] = { ...newPersons[index], ...partial };
    onChange(newPersons);
  };
  const removePerson = (index: number) => {
    const newPersons = [...persons];
    newPersons.splice(index, 1);
    onChange(newPersons);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-ink-500/20 p-4">
      {persons.map((p, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-md bg-ink-50 p-5 relative border border-ink-500/10">
          <div className="absolute right-3 top-3">
            <button
              type="button"
              className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
              onClick={() => removePerson(i)}
            >
              Delete Person
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-24">
            <div>
              <label className="text-xs text-ink-500 font-semibold mb-1 block">Name</label>
              <Input
                value={p.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updatePerson(i, { name: e.target.value })}
                placeholder="e.g. Dr. Jane Doe"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 font-semibold mb-1 block">Role / Title</label>
              <Input
                value={p.role}
                onChange={(e: ChangeEvent<HTMLInputElement>) => updatePerson(i, { role: e.target.value })}
                placeholder="e.g. Lead Instructor"
                className="text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-ink-500 font-semibold mb-1 block">Photo (Upload or URL)</label>
            <div className="flex flex-col gap-2">
              {p.imageUrl && (
                <img src={p.imageUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-ink-500/20" />
              )}
              <div className="flex items-center gap-2">
                <Input
                  value={p.imageUrl || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updatePerson(i, { imageUrl: e.target.value })}
                  placeholder="https://... or upload file"
                  className="text-sm flex-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 800000) {
                      alert("Image too large. Max 800KB.");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      updatePerson(i, { imageUrl: ev.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="text-xs w-48 border border-ink-500/20 rounded-md py-1.5 px-2 bg-white"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-ink-500 font-semibold mb-1 block">Bio</label>
            <textarea
              className="w-full rounded-md border border-ink-500/20 p-2 text-sm font-sans"
              rows={2}
              value={p.bio}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updatePerson(i, { bio: e.target.value })}
              placeholder="Short biography..."
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addPerson} className="self-start">
        + Add Resource Person
      </Button>
    </div>
  );
}

