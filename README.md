# Challenge 04

## Demo Login App Challenge - 04

Esta aplicación es una demo básica de login con rutas protegidas para mantener el inicio sesion del usuario aunque se recargue la pagina o se vuelva a usar el link en otra pestaña del navegador

### Funcionamiento

- Se inicia la app con la pagina de login la cual te pedira las credenciales:
- Las cuales son:
  - **Correo electrónico:** user@mail.com
  - **Contraseña:** 123

- Al iniciar sesion:
  - Si las credenciales son correctas, se guarda la sesion en un token en el navegador y se redirige a la página de bienvenida.
  - Si las credenciales son incorrectas se va a mostrar un mensaje de error.

- Si cierras y vuelves a abrir la app si el token existe (se inicio sesion exitosamente) entras directo a la página de bienvenida sin volver a loguearte.
- Si le das a "Cerrar sesión" este elimina el token y te redirige a la pagina de login.


