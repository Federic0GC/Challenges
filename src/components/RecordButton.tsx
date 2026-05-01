import { Square, Play } from "lucide-react";

interface Props {
  recording: boolean;
  onClick: () => void;
  label?: string;
}

export const RecordButton = ({ recording, onClick, label }: Props) => (
  <button
    onClick={onClick}
    className={`relative w-24 h-24 rounded-full flex items-center justify-center text-primary-foreground transition-transform active:scale-95 ${
      recording ? "animate-pulse-record" : "shadow-[var(--shadow-lg)]"
    }`}
    style={{ background: recording ? "var(--gradient-record)" : "var(--gradient-primary)" }}
    aria-label={label ?? (recording ? "Parar" : "Grabar")}
  >
    {recording ? <Square className="w-9 h-9 fill-current" /> : <Play className="w-9 h-9 fill-current ml-1" />}
  </button>
);
