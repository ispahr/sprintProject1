const  Database  = require("../../database");
const { encryptPassword } = require("../middlewares/middlewares");
const jwt = require("jsonwebtoken");

async function crear_cuenta(req, res) {
  const newUser = req.body.newUser;
  try {
    const Usuarios = Database.getModel('Usuarios');
    const createdUser = await Usuarios.create(newUser)
    return res.status(200).send(createdUser)

  } catch (error) {
    console.log(error)
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
  }
}

async function iniciar_sesion(req, res) {
  const { email, password } = req.body;
  let valido = false;
  try {
    if (email.includes('@') && email.includes('.') && !!password === true) {
      const Usuarios = Database.getModel('Usuarios');
      const encryptedPassword = encryptPassword(password);
      const find = await Usuarios.findOne({ where: { email: email, password: encryptedPassword } })

      if (find !== null) {
        valido = true;
        const toSend = {
          id: find.dataValues.id,
          name: find.dataValues.name,
          userName: find.dataValues.userName,
          email: find.dataValues.email,
          admin: find.dataValues.admin,
          suspended: find.dataValues.suspended
        }
        const token = createToken(toSend);
        res.status(200).send({'status_code':200, 'message':'Sesion iniciada', token : `${token}`});
      }

    } else {
      return res.status(406).send({ 'status_code': 406, 'message': "Formato de parametros en headers no valido"});
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

async function suspendUser(req,res) {
  const Usuarios = Database.getModel('Usuarios');
  const userId = req.body.userId;
  try {

    const suspended = await Usuarios.update( { suspended: 1 }, {
      where: {
        id:userId
      }
    });
    if (suspended[0] === 0) {
      res.status(400).send({ 'status_code': 400, 'message': `Usuario ${userId} no fue encontrado.`})

    } else {
      res.status(200).send({ 'status_code': 200, 'message': `Usuario ${userId} fue suspendido.`})

    }

  } catch (error) {
    console.log(error)
    res.status(200).send({ 'status_code': 200, 'message': `Error in the database`, 'error': error})

  }

}

module.exports = {
  crear_cuenta,
  iniciar_sesion,
  suspendUser
}
