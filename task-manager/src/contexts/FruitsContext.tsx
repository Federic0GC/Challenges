import React, { createContext, useContext, useEffect, useState } from "react";
import { Fruit, fruitsDb } from "../db/fruitsDb";

interface FruitsContextValue {
  fruits: Fruit[];
  addFruit: (name: string, quantity: number) => Promise<void>;
  updateFruit: (id: number, name: string, quantity: number) => Promise<void>;
  deleteFruit: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
}

const FruitsContext = createContext<FruitsContextValue | undefined>(undefined);

export const FruitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fruits, setFruits] = useState<Fruit[]>([]);

  const loadFruits = async () => {
    const all = await fruitsDb.fruits.orderBy("name").toArray();
    setFruits(all);
  };

  useEffect(() => {
    loadFruits();
  }, []);

  const addFruit = async (name: string, quantity: number) => {
    await fruitsDb.fruits.add({ name, quantity, isFavorite: false });
    await loadFruits();
  };

  const updateFruit = async (id: number, name: string, quantity: number) => {
    await fruitsDb.fruits.update(id, { name, quantity });
    await loadFruits();
  };

  const deleteFruit = async (id: number) => {
    await fruitsDb.fruits.delete(id);
    await loadFruits();
  };

  const toggleFavorite = async (id: number) => {
    const fruit = await fruitsDb.fruits.get(id);
    if (!fruit) return;
    await fruitsDb.fruits.update(id, { isFavorite: !fruit.isFavorite });
    await loadFruits();
  };

  const value: FruitsContextValue = {
    fruits,
    addFruit,
    updateFruit,
    deleteFruit,
    toggleFavorite,
  };

  return <FruitsContext.Provider value={value}>{children}</FruitsContext.Provider>;
};

export const useFruitsContext = (): FruitsContextValue => {
  const ctx = useContext(FruitsContext);
  if (!ctx) {
    throw new Error("useFruitsContext debe usarse dentro de un FruitsProvider");
  }
  return ctx;
};
