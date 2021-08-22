const { Sequelize, DataTypes } = require('Sequelize');
const modelProducts = require('./models/productos');
const modelEstado = require('./models/estado');
const modelMediosPago = require('./models/mediosPago');
const modelDirecciones = require('./models/direcciones');
const modelPedidos = require('./models/pedidos');
const modelUsers = require('./models/users');
const modelProductoPedido = require('./models/productoPedido');

let models = {};

let connection = '';

function getModel(name) {
  return models[name]
}

function getSequelize() {
  return connection
}

async function initDatabase(database, username, host) {

  const sequelize = new Sequelize({
    "database": database,
    "username": username,
    "host": host,
    "dialect": "mariadb"

  })

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  models.Productos = modelProducts(sequelize);
  models.Estado = modelEstado(sequelize);
  models.MedioPago = modelMediosPago(sequelize);
  models.Direcciones = modelDirecciones(sequelize);
  models.Pedidos = modelPedidos(sequelize);
  models.ProductoPedido = modelProductoPedido(sequelize);
  models.Usuarios = modelUsers(sequelize);

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
  return sequelize
}

//initDatabase()


module.exports = {
  initDatabase,
  getModel,
  getSequelize
}
