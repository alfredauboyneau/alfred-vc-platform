type GaugeTone = "strong" | "good" | "mixed" | "weak";

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function getGaugeTone(score: number): GaugeTone {
  if (score >= 90) return "strong";
  if (score >= 75) return "good";
  if (score >= 60) return "mixed";
  return "weak";
}

function getThemeClasses(tone: GaugeTone) {
  if (tone === "strong") {
    return {
      fill: "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600",
      ring: "border-emerald-300",
      dot: "bg-emerald-500",
      stem: "bg-emerald-300/80",
    };
  }

  if (tone === "good") {
    return {
      fill: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
      ring: "border-blue-300",
      dot: "bg-blue-500",
      stem: "bg-blue-300/80",
    };
  }

  if (tone === "mixed") {
    return {
      fill: "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500",
      ring: "border-amber-300",
      dot: "bg-amber-500",
      stem: "bg-amber-300/80",
    };
  }

  return {
    fill: "bg-gradient-to-r from-rose-300 via-rose-400 to-rose-500",
    ring: "border-rose-300",
    dot: "bg-rose-500",
    stem: "bg-rose-300/80",
  };
}

function getSegmentFill(score: number, index: number) {
  const start = index * 25;
  const progress = ((score - start) / 25) * 100;

  return Math.max(0, Math.min(100, progress));
}

export function ScoreGauge({ score }: { score: number }) {
  const clampedScore = clampScore(score);
  const theme = getThemeClasses(getGaugeTone(clampedScore));
  const markerPosition = Math.max(4, Math.min(96, clampedScore));

  return (
    <div className="mb-4">
      <div className="relative pt-5">
        <div className="pointer-events-none absolute left-0 right-0 top-0">
          <div
            className="absolute -translate-x-1/2"
            style={{ left: `${markerPosition}%` }}
          >
            <div className={`mx-auto h-3 w-px ${theme.stem}`} />
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.12)] ${theme.ring}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/80"
            >
              <div
                className={`h-full rounded-full ${theme.fill}`}
                style={{ width: `${getSegmentFill(clampedScore, index)}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between px-[1px] text-[10px] font-medium tracking-[0.16em] text-slate-400">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
