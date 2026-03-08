# Examen 01 PWA Medicare + Administracion Web

## App de la Clinica MediCare+ 
## La clinica MediCare+ Desarrolla dos APPs una orientada a una PWA para la administacion y una APP en iconic para los medicos y la gestion de las visitas de ss clientes

## Link App: https://examen01medicare.netlify.app/

## Uusuarios:
## Admin

Email: federico@medicare.com
Contraseña: federico

## Recepcionista

Email: sandra@medicare.com
Contraseña: recepcionista

## Médico

Email: juan_david@medicare.com
Contraseña: medico

## OJO la sesion del usuario se guarda en localstorage recordemos que esto nos permite mantener el inicio del sesion de nuestro usuario aun si se actualiza la pagina o se reinicia

## ¿Por qué el estado de búsqueda vive en Dashboard y no en TablaPacientes?
## El estado de busqueda se guarda en dashboard ya que es el componente padre el cual administra la lista completa de pacientes, gracias a esto es que desde ahi se puede enviar los resultados a la tabla de pacientes mediante props, siendo este un componente presentacional que solo muestra los datos siguiendo el principio de single source of truth

## ¿Qué significa la estrategia Cache First y cuándo conviene usarla en una app médica?
## Cache first es una estrategia de service worker en donde la app intenta cargar primero los recursos desde el cache de nuestro navegador, y si no estan en cache entonces los solicita a la red y los guarda para futuras usos de la app o reinicios que este tenga

<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/2f0b2d65-dfb6-436a-a643-bb95e5dd76e9" />

## A continuacion podemos visualizar que tanto la PWA con netify como la APP con Ionic se instalaron correctamente como APPs Moviles

<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/3e9de873-904b-49b6-8b6e-0b61b85015fb" />














