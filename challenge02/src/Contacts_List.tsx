import { useState } from 'react'

type Contact = {
  id: number
  name: string
  email: string
  age: number
  job: string
}

const initialContacts: Contact[] = [
  { id: 1, name: 'Federico Gonzalez Cardenas', email: 'federico.gonzalez@uao.edu.co', age: 21, job: 'Estudiante Universitario' },
  { id: 2, name: 'Juan David', email: 'juan.david@uao.edu.co', age: 23, job: 'Estudiante de medicina' },
  { id: 3, name: 'Martin Orozco', email: 'martin.orozco@gmail.com', age: 32, job: 'Ingeniero de software' },
  { id: 4, name: 'Miguel Duran', email: 'miguel.duran@hotmail.com', age: 29, job: 'Vendedor de helados' },
  { id: 5, name: 'Maria Camila', email: 'maria.camila@gmail.com', age: 25, job: 'Diseñadora' },
  { id: 6, name: 'Sofia Estrella', email: 'sofia.estrella@uao.edu.co', age: 27, job: 'Estudiante Universitario' },
  { id: 7, name: 'Luis Gómez', email: 'luis.gomez@hotmail.com', age: 22, job: 'Pasante en compañia de seguros' },
  { id: 8, name: 'Diego Ramírez', email: 'diego.ramirez@gmail.com', age: 31, job: 'Cientifico de datos' },
]

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)

  function eliminarUltimo() {
    setContacts((prev) => prev.slice(0, -1))
  }

  return (
    <section className="contacts">
      <div className="controls">
        <button className="delete-btn" onClick={eliminarUltimo} disabled={contacts.length === 0} aria-label="Eliminar último contacto">
          Eliminar último contacto
        </button>
      </div>

      <div className="list">
        {contacts.length === 0 ? (
          <p>No hay contactos.</p>
        ) : (
          contacts.map((c) => (
            <article key={c.id} className="contact-card">
              <div className="contact-row">
                <strong>Nombre:</strong> {c.name}
              </div>
              <div className="contact-row">
                <strong>Correo:</strong> {c.email}
              </div>
              <div className="contact-row">
                <strong>Edad:</strong> {c.age}
              </div>
              <div className="contact-row">
                <strong>Trabajo:</strong> {c.job}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
