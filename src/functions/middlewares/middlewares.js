const Database = require("../../database");
const { Op } = require("sequelize");
const { createHmac } = require('crypto');
const jwt = require("jsonwebtoken");

//middleware
async function validar_nueva_cuenta(req, res, next) {
  const {
    password,
    name,
    userName,
    email,
    phoneNumber
  } = req.body;

  if (!!userName && !!name && !!email && !!phoneNumber && !!password) {
    const encryptedPassword = encryptPassword(password);

    const newUser = {
      password: encryptedPassword,
      name,
      userName,
      email,
      phoneNumber,
      admin: false
    };
    // Es mejor buscarlo manualmente o utilizar el error que da la DB directamente
    try {
      const Usuarios = Database.getModel('Usuarios');
      const findEmail = Usuarios.findOne({ where: { email: newUser.email } })
      const findUsername = Usuarios.findOne({ where: { userName: newUser.userName } })

      const promesas = await Promise.all([findEmail, findUsername])
      const checkEmail = promesas[0];
      const checkUsername = promesas[1];

      if (checkEmail !== null) {
        ban = true;
        return next(new Error('email ya esta registrado'));
      } else if (checkUsername !== null) {
        ban = true;
        return next(new Error('nombre de usuario ya esta registrado'));
      }

    } catch (error) {
      console.log(error);
      return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
    }

    req.body.newUser = newUser;
    next();

  } else {
    next(new Error('campos incompletos'));
  }

}

function encryptPassword(password) {
  return createHmac('sha256', password).digest('hex');
}

function es_admin(req, res, next) {
  if (req.user.admin === true) {
    next();
  } else {
    res.status(403).send({ 'status_code': 403, 'message': 'No puede realizar esta accion' });
  }
}

function authorize(req,res,next) {
  const { JWT_KEY } = process.env;
  const bearer = req.headers.authorization || '';
  const token = bearer.replace('Bearer ','');
  jwt.verify(token, JWT_KEY, function(err, decoded) {

    if (err) {
      res.status(401).send({ 'status_code': 401, 'message': 'Usted no esta autorizado.' });
    } else {
      req.user = decoded;
      next();
    }
  });

}

function suspended(req, res, next) {
  if (req.user.suspended === false) {
    next();
  } else {
    res.status(403).send({ 'status_code': 403, 'message': 'EL usuario esta suspendido y no puede acceder.' });
  }
}

function no_admin(req, res, next) {
  if (req.user.admin === false) {
    next();
  } else {
    res.status(403).send({ 'status_code': 403, 'message': 'Usted es un usuario administrador. No puede realizar esta accion' });
  }
}

async function existe_pedido(req, res, next) {
  const pedidoId = Number(req.headers.pedidoid);

  if (!!pedidoId && Array.isArray(pedidoId) === false) {
    try {
      const id = req.user.id;
      const Pedidos = Database.getModel('Pedidos');
      const existe = await Pedidos.findOne({
        where: {
          id: pedidoId,
          UserId: id
        }
      });

      if (!!existe) {
        return next();
      }

    } catch (error) {
      return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
    }

  } else {
    return res.status(406).send({ 'status_code': 406, 'message': 'Formato de pedidoid no valido (debe ser un numero)' })

  }

  return res.status(406).send({ 'status_code': 406, 'message': 'pedidoid no encontrado' })
}


async function pedido_confirmado(req, res, next) {
  const pedidoId = Number(req.headers.pedidoid);

  const Pedidos = Database.getModel('Pedidos');
  try {
    const pedido = await Pedidos.findOne({ where: { id: pedidoId }});
    if (pedido.dataValues.estadoId === 1) {
      return next();

    } else {
      return res.status(406).send({ 'status_code': 406, 'message': 'No se puede modificar el pedido porque esta confirmado.' })
    }

  } catch (error) {
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }
}

async function existe_producto(req, res, next) {
  const { listaProductos } = req.body;

  let valido = false;
  if (Array.isArray(listaProductos) === true && listaProductos.length > 0) {
    valido = true;
  }

  const productosId = listaProductos.map((producto) => {
    return producto.ProductoId
  })

  productosId.sort()

  for (let i = 0; i < productosId.length - 1; i++) {
    if (productosId[i] === productosId[i + 1]) {
      valido = false;
    }
  }

  try {

    if (valido === true) {

      const Productos = Database.getModel('Productos');

      const allProducts = await Productos.findAll({
        attributes: ['id'],
        where:
          { id: { [Op.in]: productosId } }
      });

      if (productosId.length === allProducts.length) {
        return next()
      } else {
        return res.status(406).send({ 'status_code': 406, 'message': 'productoId debe ser un producto valido.' })

      }

    } else {
      return res.status(406).send({ 'status_code': 406, 'message': 'Body invalido. No puede incluir dos veces el mismo productoId.' })
    }
  } catch (error) {
    return res.status(406).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
  }
}


// error handler
function errorHandler(err, req, res, next) {
  const error = err.message;
  if (error !== undefined) {

    if (error === "email ya esta registrado") {
      res.status(406).send({ 'status_code': 406, 'message': "El email ya esta registrado"});
    } else if (error === "nombre de usuario ya esta registrado") {
      res.status(406).send({ 'status_code': 406, 'message': "El nombre de usuario ya se ecuentra registrado"});
    } else if (error === "campos incompletos") {
      res.status(416).send({ 'status_code': 416, 'message': "Debe completar todos los campos"});
    }
  }
}

module.exports = {
  validar_nueva_cuenta,
  errorHandler,
  es_admin,
  no_admin,
  existe_pedido,
  existe_producto,
  pedido_confirmado,
  encryptPassword,
  authorize,
  suspended
}
