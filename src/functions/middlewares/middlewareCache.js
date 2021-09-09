const { getRedis } = require("../../database");

function makeKey(req) {
  return `${req.method}_${req.baseUrl}`;
}

function writeCache(data, req) {
  const client = getRedis();
  const key = makeKey(req);

  client.set(key, JSON.stringify(data))
  console.log('Agregado a la cache');
}

function readCache(req, res, next) {
  const client = getRedis();
  const key = makeKey(req);

  client.get(key, (error,data) =>{
    if (error || !data) {
      next();
    } else {
      console.log('Leido de la cache');
      res.send(data);
    }
  })
}

function deleteCache(req) {
  const client = getRedis();
  const key = makeKey(req);
  client.del(key)
  console.log('Borrado de la cache');

}

module.exports = {
  writeCache,
  readCache,
  deleteCache
}
