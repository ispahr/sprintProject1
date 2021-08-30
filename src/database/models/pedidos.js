const { DataTypes } = require('sequelize');

function modelPedidos(connection) {
  const Pedidos = connection.define('pedidos',{
    costoTotal:{
      type: DataTypes.FLOAT,
      allowNull: false
    }

  })

  return Pedidos;
}

module.exports = modelPedidos;
