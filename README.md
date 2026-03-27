# CHALLENGE 06 - APP Integracion de base de datos en tiempo real con Firebase para taeras, guardado de contactos con Firestore, y Gestor de alimentos Dexie

OJO se trabajo esta nueva app con una plantilla de un challenge anterior, la cual nos permitio centrarnos en las novedades solicitades asi como e las nuevas integraciones trabajadas en esta APP

<img width="1600" height="833" alt="image" src="https://github.com/user-attachments/assets/15b1164a-c1bf-4660-baec-a901bdc03248" />

Este proyecto es una app la cual es multivariada, por una parte se sigue trabajando la logica de guardado de tareas u la manipulacion de estas pero con el añadido de de guardar esas tareas en la base de datos de tiempo real de firebase de la siguiente manera:

<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/5a34c790-eabd-4ed1-83c6-bb317bea4433" />


Ejemplo de cómo se guarda una tarea en la Realtime Database:

```text
tasks
  └─ t6ogLEIHDcYiW5jxIbAGEQFG3dp1
      └─ -Ook04DGDDNLLJuc8XfJ
          ├─ completed: false
          ├─ createdAt: "2026-03-27T15:58:00.031Z"
          ├─ createdByEmail: "fede2@hotmail.com"
          └─ text: "Limpiar casa"
```

Cada tarea se guarda dentro de la rama del "id" de su usuario y a su vez cada tarea tiene su propio "id" unico dentro de esa rama que podemos ver en la base de datos en tiempo real de firebase, de esta forma las tareas de usuarios diferentes no se mezclan, y cualquier cambio (crear, editar o eliminar tareas) lo podemos visualizar en tiempo real en la base de datos



## Integracion de base de datos en la nube "Firestore" para la funcionalidad del guardado de contactos del usuario

Cada vez que el usuario crea o edite un contacto desde nuestra app esta se guardara en un documento en la collecion de contacts con los campos dee name, phone y email, el userid que vamos a ver corresponde al usuario autenticado qque inicio sesion en la app.

Ejemplo de documento en la colección `contacts`:

```json
{
  "email": "fede@hotmail.com",
  "name": "Fede",
  "phone": "3152746390",
  "userId": "t6ogLEIHDcYiW5jxIbAGEQFG3dp1"
}
```

<img width="1600" height="835" alt="image" src="https://github.com/user-attachments/assets/99fe53f0-8adc-406a-891f-671180329a50" />


## Gestion de alimentos "frutas" en un almacenamiento local con Dexie

Para las frutas usamos dexie sobre indexedDB, esto nos permite guardar la informacion directamente en el dispositivo del usuario sin depender de internet guardandose cada alimento con su nombre, cantidad y un indicador de si es el favorito del suario, esta informacion estara persistente aunque se cierre y vuelva a abrir la app para el usuario

<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/7b4e896f-a79a-49ec-894b-7274018cc491" />


## Cómo ejecutar la app 

### Requisitos previos

- Tener instalado Node.js (versión LTS recomendada)
- Tener instalada la CLI de Ionic: `npm install -g @ionic/cli`

### Pasos

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Ejecuta en modo desarrollo: `ionic serve` (también puedes usar `npm run dev`)


