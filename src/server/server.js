const express = require('express')
// Routers
const pedidos = require("../routers/route_pedidos");
const productos = require("../routers/route_productos");
const usuarios = require("../routers/route_usuarios");
const documentation = require("../routers/router_swagger");
const medios_de_pago = require("../routers/route_medio_pagos");
const helmet = require('helmet');
const app = express();

app.use(express.json());
app.set('json spaces', 3);
app.use(helmet());

app.use("/api/v1/pedidos", pedidos);
app.use('/api/v1/productos', productos);
app.use('/api/v1/usuarios', usuarios);
app.use('/api/v1/medios-de-pago', medios_de_pago);

app.use('/api/v1/api-docs', documentation);


function makeServer() {
  return app;
}

module.exports = {
  makeServer
};
