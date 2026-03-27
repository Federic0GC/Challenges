import { firestore } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export interface ContactDto {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const COLLECTION_NAME = "contacts";

export async function getContacts(userId: string): Promise<ContactDto[]> {
  const q = query(
    collection(firestore, COLLECTION_NAME),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactDto, "id">) }));
}

export async function addContact(
  userId: string,
  contact: Omit<ContactDto, "id">
): Promise<void> {
  await addDoc(collection(firestore, COLLECTION_NAME), {
    userId,
    ...contact,
  });
}

export async function updateContact(
  contactId: string,
  contact: Partial<Omit<ContactDto, "id">>
): Promise<void> {
  const ref = doc(firestore, COLLECTION_NAME, contactId);
  await updateDoc(ref, contact);
}

export async function deleteContact(contactId: string): Promise<void> {
  const ref = doc(firestore, COLLECTION_NAME, contactId);
  await deleteDoc(ref);
}
