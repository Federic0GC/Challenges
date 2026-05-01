import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export const IonHeader = ({ title, subtitle, right }: Props) => (
  <header className="ion-header">
    <div className="ion-toolbar">
      <div className="flex flex-col">
        <h1 className="ion-title">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground -mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  </header>
);
