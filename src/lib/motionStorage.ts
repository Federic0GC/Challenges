import type { Sample } from "./dtw";

export interface MotionRecord {
  id: string;
  label: string;
  samples: Sample[];
  rawLength: number;
  createdAt: number;
}

const KEY = "motion_records_v1";

export function loadRecords(): MotionRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: MotionRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function addRecord(rec: MotionRecord) {
  const all = loadRecords();
  all.push(rec);
  saveRecords(all);
}

export function deleteRecord(id: string) {
  saveRecords(loadRecords().filter(r => r.id !== id));
}
