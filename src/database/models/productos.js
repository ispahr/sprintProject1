const { DataTypes } = require('sequelize');

function modelProducts(connection) {
  const Productos = connection.define('Productos',{
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    } }, 
    {
      // don't add the timestamp attributes (updatedAt, createdAt)
      // timestamps: false
    }
    )
    
    return Productos;
}

module.exports = modelProducts
