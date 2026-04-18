export type Mission = {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  enabled: boolean;
};

export type ProgressData = {
  points: number;
  missions: Array<{ id: number; completed: boolean }>;
};
