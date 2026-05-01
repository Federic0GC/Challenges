import type { Sample } from "@/lib/dtw";

interface Props {
  sample: Sample | null;
  active: boolean;
}

const Bar = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const pct = Math.min(100, Math.abs(value) * 5);
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 text-xs font-mono text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 text-right text-xs font-mono tabular-nums text-muted-foreground">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export const MotionVisualizer = ({ sample, active }: Props) => {
  const s = sample ?? [0, 0, 0, 0, 0, 0];
  return (
    <div className={`ion-card space-y-3 ${active ? "ring-2 ring-primary/40" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Acelerómetro
        </span>
        <span className={`w-2 h-2 rounded-full ${active ? "bg-success animate-pulse" : "bg-muted-foreground/40"}`} />
      </div>
      <Bar value={s[0]} label="X" color="hsl(211 100% 55%)" />
      <Bar value={s[1]} label="Y" color="hsl(268 83% 58%)" />
      <Bar value={s[2]} label="Z" color="hsl(199 89% 50%)" />
      <div className="pt-2 border-t border-border/50">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Giroscopio
        </span>
      </div>
      <Bar value={s[3]} label="α" color="hsl(38 92% 50%)" />
      <Bar value={s[4]} label="β" color="hsl(0 84% 60%)" />
      <Bar value={s[5]} label="γ" color="hsl(145 63% 45%)" />
    </div>
  );
};
