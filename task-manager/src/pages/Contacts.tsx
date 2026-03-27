import React, { useEffect, useState } from "react";
import {
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
import { useAuth } from "../hooks/useAuth";
import { useNetwork } from "../contexts/NetworkContext";
import {
  ContactDto,
  addContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../services/contactsService";

const Contacts: React.FC = () => {
  const { user } = useAuth();
  const { isOnline } = useNetwork();
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadContacts = async () => {
    if (!user) return;
    const data = await getContacts(user.uid);
    setContacts(data);
  };

  useEffect(() => {
    loadContacts();
  }, [user]);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isOnline) return;
    if (!name.trim() || !phone.trim() || !email.trim()) return;

    if (editingId) {
      await updateContact(editingId, { name: name.trim(), phone: phone.trim(), email: email.trim() });
    } else {
      await addContact(user.uid, { name: name.trim(), phone: phone.trim(), email: email.trim() });
    }

    await loadContacts();
    resetForm();
  };

  const handleEdit = (contact: ContactDto) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
  };

  const handleDelete = async (id: string) => {
    if (!isOnline) return;
    await deleteContact(id);
    await loadContacts();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contacts (Firestore)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!isOnline && (
          <p style={{ textAlign: "center", color: "orange", marginBottom: 16 }}>
            Sin conexión: puedes ver contactos pero no agregarlos ni editarlos.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput
              value={name}
              onIonChange={(e) => setName(e.detail.value || "")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Teléfono</IonLabel>
            <IonInput
              value={phone}
              onIonChange={(e) => setPhone(e.detail.value || "")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value || "")}
            />
          </IonItem>
          <IonButton
            expand="block"
            type="submit"
            style={{ marginTop: 16 }}
            disabled={!isOnline}
          >
            {editingId ? "Guardar cambios" : "Agregar contacto"}
          </IonButton>
        </form>

        {contacts.length === 0 && (
          <p style={{ marginTop: 24, textAlign: "center", color: "#888" }}>
            No hay contactos cargados.
          </p>
        )}

        {contacts.length > 0 && (
          <IonList style={{ marginTop: 24 }}>
            {contacts.map((c) => (
              <IonItem key={c.id} lines="full">
                <IonLabel>
                  <h2>{c.name}</h2>
                  <p>{c.phone}</p>
                  <p>{c.email}</p>
                </IonLabel>
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => handleEdit(c)}
                  disabled={!isOnline}
                >
                  Editar
                </IonButton>
                <IonButton
                  slot="end"
                  size="small"
                  color="danger"
                  onClick={() => handleDelete(c.id)}
                  disabled={!isOnline}
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

export default Contacts;
