import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IonHeader } from "@/components/IonHeader";
import { Button } from "@/components/ui/button";
import { Trash2, Activity } from "lucide-react";
import { deleteRecord, loadRecords, type MotionRecord } from "@/lib/motionStorage";

export const LibraryView = ({ refreshKey }: { refreshKey: number }) => {
  const [records, setRecords] = useState<MotionRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, [refreshKey]);

  const handleDelete = (id: string, label: string) => {
    deleteRecord(id);
    setRecords(loadRecords());
    toast.success(`Eliminado: ${label}`);
  };

  const grouped = records.reduce<Record<string, MotionRecord[]>>((acc, r) => {
    (acc[r.label] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="ion-page">
      <IonHeader title="Biblioteca" subtitle={`${records.length} movimientos guardados`} />
      <main className="ion-content space-y-4">
        {records.length === 0 ? (
          <div className="ion-card text-center py-12 space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Activity className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Aún no has grabado movimientos. Ve a la pestaña <b>Grabar</b>.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="ion-card space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{label}</h3>
                <span className="text-xs text-muted-foreground">{items.length} muestra(s)</span>
              </div>
              <div className="space-y-2">
                {items.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-secondary/60 rounded-lg px-3 py-2"
                  >
                    <div className="text-xs text-muted-foreground">
                      <div>{new Date(r.createdAt).toLocaleString()}</div>
                      <div className="font-mono">{r.rawLength} pts</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(r.id, r.label)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
