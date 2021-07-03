const { usuarios,pedidos, logueado,productos } = require("../base_datos/objetos");


function crear_cuenta(req,res) {
    const newUser = req.body;
    usuarios.push(newUser);
    res.send(usuarios)
}

function iniciar_sesion(req,res) {
    const email = req.headers.email;
    const password = req.headers.password;
    let registrado = false;
    
    for (const usuario of usuarios) {
        if (usuario.email === email && usuario.password === password) {
            logueado.usuario = usuario;
            logueado.sign_in = true;
            registrado = true;
            //console.log(logueado.usuario)
            //console.log(logueado.sign_in)
            res.status(200).send("Sesion iniciada")
        }
    }
    // puede iniciar sesion otro usuario sin cerrar la sesion anterior????
    
    if (registrado === false) {
        res.status(406).send("Usuario no registrado")
    }
  
}
function crear_nuevo_producto(res,req) {
    
}



module.exports = {
    crear_cuenta,
    iniciar_sesion,
}