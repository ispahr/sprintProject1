const express = require("express");

// const { validar_nueva_cuenta, errorHandler, 
//         es_admin, esta_registrado, no_admin 
        
//     } = require("./src/middlewares/middlewares");

// const { crear_nuevo_producto, editar_producto, eliminar_producto } = require("./src/productos/productos");

// const { crear_cuenta, iniciar_sesion } = require("./src/usuarios/usuarios");

// const { realizar_pedido, mostrar_pedidos, admin_ve_pedidos, admin_modifica_pedidos } = require("./src/pedidos/pedidos");

//const {swaggerUI, doc } = require("./src/documentation/docu_swagger")

const pedidos = require("./src/routers/route_pedidos");
const productos = require("./src/routers/route_productos");
const usuarios = require("./src/routers/route_usuarios");
const documentation = require("./src/routers/router_swagger");


const PORT = 9090;
const app = express();
app.use(express.json());
app.set('json spaces',3);

//SWAGGER
//app.use('/api/v1/api-docs', swaggerUI.serve, swaggerUI.setup(doc))

app.use("/api/v1/pedidos", pedidos);
app.use('/api/v1/productos', productos);
app.use('/api/v1/usuarios', usuarios);

app.use('/api/v1/api-docs',documentation)

// USUARIOS
// app.post('/api/v1/usuarios' ,validar_nueva_cuenta, errorHandler, crear_cuenta);
// app.put('/api/v1/usuarios' , iniciar_sesion);

// PRODUCTOS
// app.post('/api/v1/productos',esta_registrado, es_admin, crear_nuevo_producto);
// app.put('/api/v1/productos',esta_registrado, es_admin, editar_producto);
// app.delete('/api/v1/productos',esta_registrado, es_admin, eliminar_producto);

//PEDIDOS
// app.post('/api/v1/pedidos',esta_registrado,no_admin, realizar_pedido);
// app.get('/api/v1/pedidos',esta_registrado,no_admin, mostrar_pedidos);

// ADMIN PEDIDOS
// app.get('/api/v1/pedidos/admin',esta_registrado, es_admin, admin_ve_pedidos);
// app.put('/api/v1/pedidos/admin',esta_registrado, es_admin, admin_modifica_pedidos);




app.listen(PORT, () => console.log(`App listening to port ${PORT}`))