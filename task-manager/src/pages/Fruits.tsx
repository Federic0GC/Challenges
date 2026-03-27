import React, { useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useFruits } from "../hooks/useFruits";

const Fruits: React.FC = () => {
  const { fruits, addFruit, updateFruit, deleteFruit, toggleFavorite } = useFruits();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (editingId != null) {
      const fruit = fruits.find((f) => f.id === editingId);
      if (fruit) {
        setName(fruit.name);
        setQuantity(String(fruit.quantity));
      }
    }
  }, [editingId, fruits]);

  const resetForm = () => {
    setName("");
    setQuantity("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!name.trim() || isNaN(q) || q <= 0) return;

    if (editingId != null) {
      await updateFruit(editingId, name.trim(), q);
    } else {
      await addFruit(name.trim(), q);
    }

    resetForm();
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fruits (Dexie)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Nombre de fruta</IonLabel>
            <IonInput
              value={name}
              onIonChange={(e) => setName(e.detail.value || "")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Cantidad</IonLabel>
            <IonInput
              type="number"
              value={quantity}
              onIonChange={(e) => setQuantity(e.detail.value || "")}
            />
          </IonItem>
          <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
            {editingId != null ? "Guardar cambios" : "Agregar fruta"}
          </IonButton>
          {editingId != null && (
            <IonButton
              expand="block"
              fill="clear"
              color="medium"
              onClick={handleCancelEdit}
            >
              Cancelar edición
            </IonButton>
          )}
        </form>

        {fruits.length === 0 && (
          <p style={{ marginTop: 24, textAlign: "center", color: "#888" }}>
            No hay frutas cargadas.
          </p>
        )}

        {fruits.length > 0 && (
          <IonList style={{ marginTop: 24 }}>
            {fruits.map((fruit) => (
              <IonItem key={fruit.id} lines="full">
                <IonLabel>
                  <h2>{fruit.name}</h2>
                  <p>Cantidad: {fruit.quantity}</p>
                </IonLabel>
                <IonBadge color={fruit.isFavorite ? "warning" : "medium"} slot="start">
                  {fruit.isFavorite ? "★ Fav" : ""}
                </IonBadge>
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => toggleFavorite(fruit.id!)}
                >
                  {fruit.isFavorite ? "Quitar fav" : "Marcar fav"}
                </IonButton>
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => handleEdit(fruit.id!)}
                >
                  Editar
                </IonButton>
                <IonButton
                  slot="end"
                  size="small"
                  color="danger"
                  onClick={() => deleteFruit(fruit.id!)}
                >
                  Eliminar
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Fruits;
