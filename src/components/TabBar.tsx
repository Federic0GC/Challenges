import { Activity, Library, Sparkles } from "lucide-react";

export type TabKey = "record" | "library" | "test";

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

const tabs: { key: TabKey; label: string; Icon: typeof Activity }[] = [
  { key: "record", label: "Grabar", Icon: Activity },
  { key: "library", label: "Biblioteca", Icon: Library },
  { key: "test", label: "Probar", Icon: Sparkles },
];

export const TabBar = ({ active, onChange }: Props) => (
  <nav className="ion-tab-bar">
    {tabs.map(({ key, label, Icon }) => {
      const isActive = active === key;
      return (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="flex flex-col items-center gap-1 px-4 py-2 transition-colors"
        >
          <Icon
            className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
            strokeWidth={isActive ? 2.4 : 2}
          />
          <span className={`text-[11px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);
