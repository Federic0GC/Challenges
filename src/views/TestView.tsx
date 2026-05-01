import { useState } from "react";
import { toast } from "sonner";
import { IonHeader } from "@/components/IonHeader";
import { MotionVisualizer } from "@/components/MotionVisualizer";
import { RecordButton } from "@/components/RecordButton";
import { Button } from "@/components/ui/button";
import { useMotionRecorder } from "@/hooks/useMotionRecorder";
import { dtw, preprocess } from "@/lib/dtw";
import { loadRecords, addRecord } from "@/lib/motionStorage";
import { Check, Sparkles, X } from "lucide-react";

interface Match {
  label: string;
  distance: number;
  confidence: number;
}

export const TestView = ({ onChange }: { onChange: () => void }) => {
  const { permission, requestPermission, isRecording, start, stop, liveSample, duration } = useMotionRecorder();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [lastSamplesRaw, setLastSamplesRaw] = useState<number[][] | null>(null);

  const analyze = (rawSamples: number[][]) => {
    const records = loadRecords();
    if (records.length === 0) {
      toast.error("Primero graba algunos movimientos");
      return;
    }
    const probe = preprocess(rawSamples, 64);

    const perLabel: Record<string, number> = {};
    for (const r of records) {
      const d = dtw(probe, r.samples);
      if (perLabel[r.label] == null || d < perLabel[r.label]) perLabel[r.label] = d;
    }
    const sorted = Object.entries(perLabel)
      .map(([label, distance]) => ({ label, distance }))
      .sort((a, b) => a.distance - b.distance);

    const minD = sorted[0].distance;
    const maxD = sorted[sorted.length - 1].distance;
    const range = Math.max(0.001, maxD - minD);
    const result: Match[] = sorted.map((m) => ({
      ...m,
      confidence: Math.max(0, Math.min(100, (1 - (m.distance - minD) / range) * 100)),
    }));
    if (result.length === 1) result[0].confidence = 100;
    setMatches(result);
  };

  const handleToggle = async () => {
    if (isRecording) {
      const data = stop();
      if (data.length < 5) {
        toast.error("Movimiento demasiado corto");
        return;
      }
      setLastSamplesRaw(data);
      analyze(data);
    } else {
      setMatches(null);
      setLastSamplesRaw(null);
      const ok = await start();
      if (!ok) toast.error("Permiso de sensor denegado");
    }
  };

  const handleConfirm = () => {
    if (!matches || !lastSamplesRaw) return;
    const top = matches[0];
    const samples = preprocess(lastSamplesRaw, 64);
    addRecord({
      id: crypto.randomUUID(),
      label: top.label,
      samples,
      rawLength: lastSamplesRaw.length,
      createdAt: Date.now(),
    });
    toast.success(`Guardado en "${top.label}"`);
    setMatches(null);
    setLastSamplesRaw(null);
    onChange();
  };

  const top = matches?.[0];

  return (
    <div className="ion-page">
      <IonHeader title="Probar movimiento" subtitle="Reproduce un gesto guardado" />
      <main className="ion-content space-y-5">
        {permission === "unknown" && (
          <div className="ion-card text-center space-y-3">
            <p className="text-sm text-muted-foreground">Activa los sensores para probar.</p>
            <Button onClick={requestPermission} className="w-full">Permitir sensores</Button>
          </div>
        )}

        <MotionVisualizer sample={liveSample} active={isRecording} />

        <div className="ion-card flex flex-col items-center gap-4 py-8">
          <RecordButton recording={isRecording} onClick={handleToggle} />
          <div className="text-center">
            <div className="text-2xl font-mono tabular-nums font-semibold">{duration.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground mt-1">
              {isRecording ? "Grabando gesto…" : "Pulsa para probar"}
            </div>
          </div>
        </div>

        {matches && top && (
          <div className="ion-card space-y-4 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Coincidencia detectada
              </div>
              <div
                className="text-3xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                {top.label}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                distancia {top.distance.toFixed(3)} · similitud {top.confidence.toFixed(0)}%
              </div>
            </div>

            {matches.length > 1 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Otras opciones
                </div>
                {matches.slice(1, 4).map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-sm flex-1 truncate">{m.label}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground/50" style={{ width: `${m.confidence}%` }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                      {m.confidence.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => { setMatches(null); setLastSamplesRaw(null); }} className="flex-1">
                <X className="w-4 h-4 mr-2" /> Descartar
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <Check className="w-4 h-4 mr-2" /> Guardar como "{top.label}"
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
