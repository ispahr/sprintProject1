const express = require("express");


const {crear_cuenta, iniciar_sesion} = require("./functions/functions")
const {validar_nueva_cuenta, errorHandler, es_admin, esta_registrado } = require("./functions/middlewares")



const PORT = 9090;
const app = express();
app.use(express.json());
app.set('json spaces',3);


// USUARIOS
app.post('/usuarios' ,validar_nueva_cuenta, errorHandler, crear_cuenta);
app.put('/usuarios' , iniciar_sesion);

// PRODUCTOS
app.post('/productos', es_admin, esta_registrado,);



app.listen(PORT, () => console.log(`App listening to port ${PORT}`))