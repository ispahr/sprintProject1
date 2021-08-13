const { DataTypes } = require('sequelize');

function modelDirecciones(connection) {
  const direcciones = connection.define('direcciones', {
    direccion:{
      type: DataTypes.STRING,
      allowNull: false
    },
    default: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
  })

  return direcciones
}

module.exports = modelDirecciones;