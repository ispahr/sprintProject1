const express = require("express");

const PORT = 9090;
const app = express();
app.use(express.json());
app.set('json spaces',3);

// Routers
const pedidos = require("./src/routers/route_pedidos");
const productos = require("./src/routers/route_productos");
const usuarios = require("./src/routers/route_usuarios");
const documentation = require("./src/routers/router_swagger");


app.use("/api/v1/pedidos", pedidos);
app.use('/api/v1/productos', productos);
app.use('/api/v1/usuarios', usuarios);

app.use('/api/v1/api-docs',documentation);

app.listen(PORT, () => console.log(`App listening to port ${PORT}`))