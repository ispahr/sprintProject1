const { DataTypes } = require('sequelize');

function modelEstado(connection) {
  const estado = connection.define('estado', {
    name:{
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return estado
}

module.exports = modelEstado;