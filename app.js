const { makeServer } = require("./src/server/server");

const { initDatabase, getModel } = require("./src/database");
const { config } = require('dotenv');
const { createSampleData } = require("./src/sampleData/sampleData");

config();
const { DB_USERNAME,
  DB_NAME,
  PORT,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST } = process.env;

async function main() {
  const SERVER_PORT = PORT || 9090;

  //Database
  try {
    const connection = await initDatabase(DB_NAME, DB_USERNAME, DB_HOST, DB_PASSWORD,DB_PORT)

    const encontrado = await getModel('Usuarios').findOne( { where: { email: 'pepito@gmail.com'}})
    if (!!encontrado === false) {
      await createSampleData()
    }

  } catch (error) {
    console.log('\n Error al inicar la DB \n\n', error)
  }
  const server = makeServer()

  server.listen(SERVER_PORT, () => console.log(`App listening to port ${SERVER_PORT}`))
}

main();
