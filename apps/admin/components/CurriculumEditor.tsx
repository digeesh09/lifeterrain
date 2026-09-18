import { Button, Input } from "@lifeterrain/ui";

export interface TimelineDay {
  day: string;
  heading: string;
  points: string[];
}

export function CurriculumEditor({
  value,
  onChange,
}: {
  value: TimelineDay[];
  onChange: (v: TimelineDay[]) => void;
}) {
  const days = value || [];

  const addDay = () => onChange([...days, { day: `Day ${days.length + 1}`, heading: "", points: [""] }]);
  const updateDay = (index: number, partial: Partial<TimelineDay>) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], ...partial };
    onChange(newDays);
  };
  const removeDay = (index: number) => {
    const newDays = [...days];
    newDays.splice(index, 1);
    onChange(newDays);
  };

  const updatePoint = (dayIndex: number, pointIndex: number, text: string) => {
    const newDays = [...days];
    const newPoints = [...newDays[dayIndex].points];
    newPoints[pointIndex] = text;
    newDays[dayIndex].points = newPoints;
    onChange(newDays);
  };
  const addPoint = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].points.push("");
    onChange(newDays);
  };
  const removePoint = (dayIndex: number, pointIndex: number) => {
    const newDays = [...days];
    const newPoints = [...newDays[dayIndex].points];
    newPoints.splice(pointIndex, 1);
    newDays[dayIndex].points = newPoints;
    onChange(newDays);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-ink-500/20 p-4">
      {days.map((d, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-md bg-ink-50 p-5 relative border border-ink-500/10">
          <div className="absolute right-3 top-3">
            <button
              type="button"
              className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
              onClick={() => removeDay(i)}
            >
              Delete Day
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-24">
            <Input
              value={d.day}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDay(i, { day: e.target.value })}
              placeholder="e.g. Day 1"
              className="text-sm"
            />
            <Input
              value={d.heading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDay(i, { heading: e.target.value })}
              placeholder="Heading (e.g. Introduction)"
              className="text-sm"
            />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <label className="text-xs font-semibold text-ink-500">Points Covered</label>
            {d.points.map((p, j) => (
              <div key={j} className="flex items-start gap-2">
                <textarea
                  value={p}
                  rows={2}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePoint(i, j, e.target.value)}
                  placeholder="e.g. Basics of GHG"
                  className="w-full rounded-md border border-ink-500/20 p-2 text-sm font-sans flex-1 resize-y min-h-[60px]"
                />
                <button
                  type="button"
                  className="rounded-md bg-ink-100 hover:bg-red-50 text-ink-400 hover:text-red-600 flex items-center justify-center h-8 w-8 text-lg font-bold transition-colors mt-0.5"
                  onClick={() => removePoint(i, j)}
                  title="Remove point"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-left text-xs font-semibold text-forest-600 hover:text-forest-700 mt-1"
              onClick={() => addPoint(i)}
            >
              + Add Point
            </button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addDay} className="self-start">
        + Add Day
      </Button>
    </div>
  );
}

