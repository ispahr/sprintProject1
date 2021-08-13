const { Sequelize, DataTypes } = require('Sequelize');

async function initDatabase(database, username) {
  const connection = new Sequelize({
    "database": "restaurante",
    "username": "root",
    "host": "localhost",
    "dialect": "mariadb"

  })

  return connection
}

function allModels() {
  // mete todos los models en un objeto
}

function getModel(name) {
  
}


  
async function main() {
  const connection = await initDatabase();
  
  try {
    await connection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
  // const person = modelProducts(conncetion);
  // await conncetion.sync()
  // console.log(person)
  
}

main()