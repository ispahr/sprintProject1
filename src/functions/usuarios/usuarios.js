const { getModel } = require("../../database");
const { logueado } = require("../../database/objetos");
const { encryptPassword } = require("../middlewares/middlewares");
const jwt = require("jsonwebtoken");

async function crear_cuenta(req, res) {
  const newUser = req.body.newUser;
  try {
    const Usuarios = getModel('Usuarios');
    const createdUser = await Usuarios.create(newUser)
    return res.status(200).send(createdUser)

  } catch (error) {
    console.log(error)
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
  }
}

async function iniciar_sesion(req, res) {
  const email = req.headers.email;
  const password = req.headers.password;
  let valido = false;

  try {
    if (email.includes('@') && email.includes('.') && !!password === true) {
      const Usuarios = getModel('Usuarios');
      const encryptedPassword = encryptPassword(password);
      const find = await Usuarios.findOne({ where: { email: email, password: encryptedPassword } })

      valido = true;

      if (find !== null) {
        const toSend = {
          id: find.dataValues.id,
          name: find.dataValues.name,
          userName: find.dataValues.userName,
          email: find.dataValues.email,
          admin: find.dataValues.admin
        }
        const token = createToken(toSend);
        logueado.token = token;
        res.status(200).send(`Sesion iniciada ${token}`);
      }

    } else {
      res.status(406).send({ 'status_code': 406, 'message': "Formato de parametros en headers no valido"});
    }

  } catch (error) {
    console.log(error);
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })

  }
  if (valido === false) {
    return res.status(406).send({ 'status_code': 406, 'message': "Usuario no registrado"})
  }

}

function createToken(data) {
  const key = process.env.JWT_KEY;
  return jwt.sign(data, key);
}

module.exports = {
  crear_cuenta,
  iniciar_sesion
}
