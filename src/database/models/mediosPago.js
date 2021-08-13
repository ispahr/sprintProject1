const { DataTypes } = require('sequelize');

function modelMediosPago(connection) {
  const mediosPago = connection.define('mediosPago', {
    name:{
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  return mediosPago
}

module.exports = modelMediosPago;