# Sprint Project: Acamica

Alumno: Ignacio Javier Spahr Baya

La API del restaurante Delilha Restó implementada en los servidores de Amazon Web Services

## URL

```
https://www.restaurante-ignacio.ml
```
## Dirección
El sitio se encuentra corriendo. Si se entra a la dirección https://www.restaurante-ignacio.ml se
ecuentra con la página de inicio de muestra.

Ingresando a https://www.restaurante-ignacio.ml/api/v1/productos se puede ver que la api da una respuesta que no se puede acceder porque no esta logueado, es decir que la api funciona.

Si desea puede hacer una petición PUT a https://www.restaurante-ignacio.ml/api/v1/usuarios con los siguientes datos en el body para iniciar sesión y comprobar el funcionamiento.

```
{
  "email":"juan@gmail.com",
  "password":"juan"
}
```


## Conexión Instancia por SSH
Están disponibles el archivo intancia-balanceador-1.pem para realizar la conexión y las credenciales de Amazon Web Services para que sea posible la conexion a la instancia. La instancia a la que debe conectarse es "restautante-api".
