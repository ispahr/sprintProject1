const express = require("express");
// Routers
const pedidos = require("./src/routers/route_pedidos");
const productos = require("./src/routers/route_productos");
const usuarios = require("./src/routers/route_usuarios");
const documentation = require("./src/routers/router_swagger");
const medios_de_pago = require("./src/routers/route_medio_pagos");

const { initDatabase } = require("./src/database");
const { config } = require('dotenv')

config();
const { DB_USERNAME,
  DB_NAME,
  PORT,
  DB_HOST } = process.env;

async function main() {

  //Database
  try {
    const connection = await initDatabase(DB_NAME, DB_USERNAME, DB_HOST)

  } catch (error) {
    console.log('\n Error al inicar la DB \n\n', error)
  }


  const app = express();
  app.use(express.json());
  app.set('json spaces', 3);

  app.use("/api/v1/pedidos", pedidos);
  app.use('/api/v1/productos', productos);
  app.use('/api/v1/usuarios', usuarios);
  app.use('/api/v1/medios-de-pago', medios_de_pago);

  app.use('/api/v1/api-docs', documentation);

  app.listen(PORT, () => console.log(`App listening to port ${PORT}`))
}

main();
