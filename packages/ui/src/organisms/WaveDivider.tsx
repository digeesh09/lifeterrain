export function WaveDivider({ flip, fill = "#ffffff" }: { flip?: boolean; fill?: string }) {
  return (
    <div className={flip ? "rotate-180" : ""} aria-hidden>
      <svg viewBox="0 0 1440 80" className="block h-10 w-full md:h-16" preserveAspectRatio="none">
        <path
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
