const express = require("express");

const { 
        crear_cuenta, iniciar_sesion, crear_nuevo_producto, 
        editar_producto, eliminar_producto, realizar_pedido, mostrar_pedidos
    
    } = require("./functions/functions");

const { validar_nueva_cuenta, errorHandler, 
        es_admin, esta_registrado, no_admin 
        
    } = require("./functions/middlewares");

const {swaggerUI, doc } = require("./docu_swagger")


const PORT = 9090;
const app = express();
app.use(express.json());
app.set('json spaces',3);

//SWAGGER
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(doc))

// USUARIOS
app.post('/usuarios' ,validar_nueva_cuenta, errorHandler, crear_cuenta);
app.put('/usuarios' , iniciar_sesion);

// PRODUCTOS
app.post('/productos',esta_registrado, es_admin, crear_nuevo_producto);
app.put('/productos',esta_registrado, es_admin, editar_producto);
app.delete('/productos',esta_registrado, es_admin, eliminar_producto);

//PEDIDOS
app.post('/pedidos',esta_registrado,no_admin, realizar_pedido);
app.get('/pedidos',esta_registrado,no_admin, mostrar_pedidos);



app.listen(PORT, () => console.log(`App listening to port ${PORT}`))