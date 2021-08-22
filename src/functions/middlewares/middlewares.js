const { getModel } = require("../../database");
const { pedidos, logueado,productos, medios_pago } = require("../../database/objetos");
const { Op } = require("sequelize");


//middleware
async function validar_nueva_cuenta(req,res,next) {
    const newUser = req.body;

    const userName = !!newUser.userName;
    const name = !!newUser.name;
    const email = !!newUser.email;
    const phoneNumber = !!newUser.phoneNumber;
    const password = !!newUser.password;

    req.body.admin = false;

    let ban = false;
    if (userName && name && email && phoneNumber && password ) {
        // Es mejor buscarlo manualmente o utilizar el error que da la DB directamente
        try {
            const Usuarios = getModel('Usuarios');
            const findEmail = Usuarios.findOne({ where: {email: newUser.email} })
            const findUsername = Usuarios.findOne({ where: {userName: newUser.userName} })

            const promesas = await Promise.all([findEmail, findUsername])
            const checkEmail = promesas[0];
            const checkUsername = promesas[1];

            if (checkEmail !== null) {
                ban = true;
                next(new Error('email ya esta registrado'));
            } else if (checkUsername !== null) {
                ban = true;
                next(new Error('nombre de usuario ya esta registrado'));
            }

        } catch (er) {
            console.log(er)
        }

    } else{
        ban = true;
        next(new Error('campos incompletos'));
    }

    if (ban === false){
        next();
    }
}


function es_admin(req,res,next) {
    if (logueado.usuario.admin === true) {
        next();
    } else {
        res.status(403).send({'status_code':403,'message':'No puede realizar esta accion'});
    }
}

function esta_registrado(req,res,next) {
    if (logueado.sign_in === false){
        res.status(403).send({'status_code':403,'message':'Debe iniciar sesion para realizar esta accion'});
    } else{
        next();
    }
}

function no_admin(req,res,next) {
    if (logueado.usuario.admin === false) {
        next();
    } else {
        res.status(403).send({'status_code':403,'message':'Usted es un usuario administrador. No puede realizar esta accion'});
    }
}

async function existe_pedido(req,res,next) {
    const pedidoId = Number(req.headers.pedidoid);

    if (!!pedidoId && Array.isArray(pedidoId) === false) {
      try {

        const Pedidos = getModel('Pedidos');
        const existe = await Pedidos.findOne({ where: {
          id: pedidoId,
          UserId: logueado.usuario.id
        }});

        if (!!existe) {
          return next();
        }

      } catch (error) {
        res.status(400).send({'status_code':400,'message':'Error in the database', 'error':error})
      }

    } else{
        return res.status(406).send({'status_code':406,'message':'Formato de pedidoid no valido (debe ser un numero)'})

    }

    return res.status(406).send({'status_code':406,'message':'pedidoid no encontrado'})
}


function pedido_confirmado(req,res,next) {
    const pos_pedido = Number(req.headers.pos_pedido);
    if (pedidos[pos_pedido].estado === 'pendiente'){
        next();
    } else{
        return res.status(406).send({'status_code':406,'message':'No se puede modificar el pedido porque esta confirmado.'})
    }
}

async function existe_producto(req,res,next) {
    const { listaProductos } = req.body;

    let valido = false;
    if (Array.isArray(listaProductos) === true && listaProductos.length > 0) {
        valido = true;
    }

    const productosId = listaProductos.map( (producto) => {
      return producto.productoId
    })

    productosId.sort()

    for (let i = 0; i < productosId.length-1; i++) {
      if (productosId[i] === productosId[i + 1] ) {
        valido = false;
      }
    }

    try {

      if (valido === true){

        const Productos = getModel('Productos');

        const allProducts = await Productos.findAll( { attributes : ['id'] ,
          where:
           {id: { [Op.in]: productosId }}
        });

        if (productosId.length === allProducts.length) {
          return next()
        } else {
          return res.status(406).send({'status_code':406,'message':'productoId debe ser un producto valido.'})

        }

      } else {
        return res.status(406).send({'status_code':406,'message':'Body invalido. No puede incluir dos veces el mismo productoId.'})
      }
    } catch (error) {
      return res.status(406).send({'status_code':400,'message':'Error in the database', 'error':error})
    }
}


// error handler
function errorHandler(err,req,res,next) {
    const error = err.message;
    if (error !== undefined){

        if (error === "email ya esta registrado"){
            res.status(406).send("El email ya esta registrado");
        } else if (error === "nombre de usuario ya esta registrado"){
            res.status(406).send("El nombre de usuario ya se ecuentra registrado");
        } else if (error === "campos incompletos"){
            res.status(416).send("Debe completar todos los campos");
        }
    }
}

module.exports = {
    validar_nueva_cuenta,
    errorHandler,
    es_admin,
    esta_registrado,
    no_admin,
    existe_pedido,
    existe_producto,
    pedido_confirmado
}
