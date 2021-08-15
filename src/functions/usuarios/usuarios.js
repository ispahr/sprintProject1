const { usuarios,pedidos, logueado,productos } = require("../../database/objetos");


function crear_cuenta(req,res) {
    const newUser = req.body;
    usuarios.push(newUser);
    res.status(200).send(usuarios)
}

function iniciar_sesion(req,res) {
    const email = req.headers.email;
    const password = req.headers.password;
    let valido = false;

    if (email.includes('@') && email.includes('.') && !!password === true) {
    
        for (const usuario of usuarios) {
            if (usuario.email === email && usuario.password === password) {
                logueado.usuario = usuario;
                logueado.sign_in = true;
                valido = true;
                
                res.status(200).send("Sesion iniciada")
            }
        }
    } else{
        valido = true;
        res.status(406).send("Formato de parametros en headers no valido");
    }
    
    if (valido === false) {
        res.status(406).send("Usuario no registrado")
    }
  
}

module.exports = {
    crear_cuenta,
    iniciar_sesion
}