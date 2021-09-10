# Sprint Project: Acamica

Alumno: Ignacio Javier Spahr Baya

El trabajo consiste en crear un API con NodeJS para el restaurante Delilah Restó, para que éste pueda gestionar los pedidos.

## **Dependencias:**
- express
- swagger-ui-express
- yamljs
- sequelize
- dotenv
- jsonwebtoken
- mariadb
- redis
- helmet
- cahi
- cahi-http
- sinon
- mocha

## Para inicar la base de datos
---
La base de datos funciona con un manejador compatible con MariaDB o MySQL.

Para inicar la base de datos se necesita completar las variables de entorno. Para eso puede crear un archivo .env ya que la aplicación implemeta el paquete `dotenv`. Aquí el detalle de las variables:

```
DB_USERNAME = Nombre de usuario
DB_PASSWORD = Contraseña de usuario
DB_NAME = Nombre de la base de datos
PORT = Puerto donde corre el servidor de la aplicacion. Por defecto es el 9090
DB_HOST = El host de la base de datos. Recomendacion: localhost
DB_PORT = El puerto donde corre la base de datos. Recomendacion: 3306, ya que es el puerto por defecto de MySQL
JWT_KEY = Clave para usar jsonwebtoken
```

La primera vez que se ejecute la base de datos se van a cargar unos datos de prueba, así esta lista para interactuar con ella.

Los datos de los usuarios son:
```
  Usuario Administrador:
    - email: pepito@gmail.com
    - contraseña: pepito

  Usuario comprador:
    - email: juan@gmail.com
    - contraseña: juan
```

## Probando las rutas
Cuando pruebe las rutas, debe ingresar en Authorization un Bearer Token para tener acceso todas las rutas, excepto en la de Crear Usuario y en la de Iniciar Sesión.

## Para iniciar el servidor
---
Primero debe posicionarse en la carpeta 'SprintProject1'

`Si tiene instalado nodemon puede usar `

> npm run dev

`Tambien puede usar solo node`

> node app.js
