const { DataTypes } = require('sequelize');

function modelProductoPedido(connection) {
  const productoPedido = connection.define('productoPedido', {
    cantidad:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  return productoPedido
}

module.exports = modelProductoPedido;