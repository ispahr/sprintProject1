const { getModel } = require("../../database");

async function addAddress(req, res) {
  const { direccion } = req.body;

  const Direcciones = getModel('Direcciones');
  const id = req.user.id;
  const oneDir = await Direcciones.findOne({ where: { UserId: id } });
  const defaults = oneDir ? false : true;

  const added = await Direcciones.create({
    direccion: direccion,
    default: defaults,
    UserId: id
  })

  res.status(200).send({ 'status_code': 200, 'message': `Direccion agregada para el usuario ${id}` })
}

async function getAddresses(req, res) {
  const id = req.user.id;

  const Direcciones = getModel('Direcciones');
  try {
    const allDirs = await Direcciones.findAll({ where: { UserId: id } });
    res.status(200).send(allDirs);

  } catch (error) {
    console.log(error);
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });

  }

}

module.exports = {
  addAddress,
  getAddresses
}
