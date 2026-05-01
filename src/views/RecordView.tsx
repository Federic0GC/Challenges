import { useState } from "react";
import { toast } from "sonner";
import { IonHeader } from "@/components/IonHeader";
import { MotionVisualizer } from "@/components/MotionVisualizer";
import { RecordButton } from "@/components/RecordButton";
import { useMotionRecorder } from "@/hooks/useMotionRecorder";
import { preprocess } from "@/lib/dtw";
import { addRecord } from "@/lib/motionStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import type { Sample } from "@/lib/dtw";

export const RecordView = ({ onSaved }: { onSaved: () => void }) => {
  const { permission, requestPermission, isRecording, start, stop, liveSample, duration } = useMotionRecorder();
  const [pending, setPending] = useState<Sample[] | null>(null);
  const [label, setLabel] = useState("");

  const handleToggle = async () => {
    if (isRecording) {
      const data = stop();
      if (data.length < 5) {
        toast.error("Movimiento demasiado corto");
        setPending(null);
        return;
      }
      setPending(data);
      toast.success(`Capturadas ${data.length} muestras`);
    } else {
      setPending(null);
      const ok = await start();
      if (!ok) toast.error("Permiso de sensor denegado");
    }
  };

  const handleSave = () => {
    if (!pending || !label.trim()) {
      toast.error("Añade una etiqueta");
      return;
    }
    const samples = preprocess(pending, 64);
    addRecord({
      id: crypto.randomUUID(),
      label: label.trim(),
      samples,
      rawLength: pending.length,
      createdAt: Date.now(),
    });
    toast.success(`Guardado: ${label}`);
    setPending(null);
    setLabel("");
    onSaved();
  };

  return (
    <div className="ion-page">
      <IonHeader title="Grabar movimiento" subtitle="Sostén el móvil y realiza el gesto" />
      <main className="ion-content space-y-5">
        {permission === "unsupported" && (
          <div className="ion-card text-center text-sm text-muted-foreground">
            Este dispositivo no soporta sensores de movimiento. Abre la app desde un móvil.
          </div>
        )}

        {permission === "unknown" && (
          <div className="ion-card text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Necesitamos acceso al acelerómetro y giroscopio.
            </p>
            <Button onClick={requestPermission} className="w-full">
              Permitir sensores
            </Button>
          </div>
        )}

        <MotionVisualizer sample={liveSample} active={isRecording} />

        <div className="ion-card flex flex-col items-center gap-4 py-8">
          <RecordButton recording={isRecording} onClick={handleToggle} />
          <div className="text-center">
            <div className="text-2xl font-mono tabular-nums font-semibold">
              {duration.toFixed(1)}s
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isRecording ? "Grabando…" : pending ? `${pending.length} muestras listas` : "Pulsa para empezar"}
            </div>
          </div>
        </div>

        {pending && !isRecording && (
          <div className="ion-card space-y-3 animate-slide-up">
            <label className="text-sm font-medium">Etiqueta del movimiento</label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ej. Sacudir, Círculo, Inclinar…"
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPending(null)} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" /> Descartar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" /> Guardar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
