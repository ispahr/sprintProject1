const { makeServer } = require("./src/server/server");

const { initDatabase } = require("./src/database");
const { config } = require('dotenv');

config();
const { DB_USERNAME,
  DB_NAME,
  PORT,
  DB_HOST } = process.env;

async function main() {
  //Database
  try {
    const connection = await initDatabase(DB_NAME, DB_USERNAME, DB_HOST)

  } catch (error) {
    console.log('\n Error al inicar la DB \n\n', error)
  }
  const server = makeServer()

  server.listen(PORT, () => console.log(`App listening to port ${PORT}`))
}

main();
