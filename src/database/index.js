const { Sequelize, DataTypes } = require('sequelize');
const modelProducts = require('./models/productos');
const modelEstado = require('./models/estado');
const modelMediosPago = require('./models/mediosPago');
const modelDirecciones = require('./models/direcciones');
const modelPedidos = require('./models/pedidos');
const modelUsers = require('./models/users');
const modelProductoPedido = require('./models/productoPedido');
const redis = require('redis');

let models = {};

let connection = '';

let clientRedis = '';

function getRedis() {
  return clientRedis;
}

function getModel(name) {
  return models[name]
}

function getSequelize() {
  return connection
}

async function initDatabase(database, username, host = 'localhost', password, db_port =3306 ) {

  const sequelize = new Sequelize({
    "database": database,
    "username": username,
    "port": db_port,
    "host": host,
    "dialect": "mariadb",
    "password": password
  })

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  //redis
  const client = redis.createClient({
	host: 'cluster-api-restaurante.yjlmbg.0001.sae1.cache.amazonaws.com',
	port: 6379
  });
  client.on("error", function(error) {
    console.error(error);
    throw new Error(error);
  });
  clientRedis = client;

  models.Usuarios = modelUsers(sequelize);
  models.Estado = modelEstado(sequelize);
  models.MedioPago = modelMediosPago(sequelize);
  models.Direcciones = modelDirecciones(sequelize);
  models.Productos = modelProducts(sequelize);
  models.Pedidos = modelPedidos(sequelize);
  models.ProductoPedido = modelProductoPedido(sequelize);

  sequelize.sync(
    //{ alter: true }
  )

  models.Usuarios.hasMany(models.Pedidos);
  models.Pedidos.belongsTo(models.Usuarios);

  models.Pedidos.hasMany(models.ProductoPedido);
  models.ProductoPedido.belongsTo(models.Pedidos);

  models.Productos.hasMany(models.ProductoPedido);
  models.ProductoPedido.belongsTo(models.Productos);

  models.Estado.hasMany(models.Pedidos);
  models.Pedidos.belongsTo(models.Estado);

  models.MedioPago.hasMany(models.Pedidos);
  models.Pedidos.belongsTo(models.MedioPago);

  models.Direcciones.hasMany(models.Pedidos);
  models.Pedidos.belongsTo(models.Direcciones);

  models.Usuarios.hasMany(models.Direcciones);
  models.Direcciones.belongsTo(models.Usuarios);

  connection = sequelize;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(sequelize);
    }, 500)
  })
}


module.exports = {
  initDatabase,
  getModel,
  getSequelize,
  getRedis
}
