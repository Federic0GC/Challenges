import Dexie, { Table } from "dexie";

export interface Fruit {
  id?: number;
  name: string;
  quantity: number;
  isFavorite: boolean;
}

class FruitsDatabase extends Dexie {
  fruits!: Table<Fruit, number>;

  constructor() {
    super("FruitsDatabase");
    this.version(1).stores({
      fruits: "++id,name,isFavorite",
    });
  }
}

export const fruitsDb = new FruitsDatabase();
