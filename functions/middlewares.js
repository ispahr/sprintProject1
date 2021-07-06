const { usuarios,pedidos, logueado,productos } = require("../base_datos/objetos");


//middleware
function validar_nueva_cuenta(req,res,next) {
    const newUser = req.body;

    const userName = !!newUser.userName;
    const name = !!newUser.name;
    const email = !!newUser.email;
    const phoneNumber = !!newUser.phoneNumber;
    const adrress = !!newUser.adrress;
    const password = !!newUser.password;

    req.body.admin = false;
    
    let ban = false;
    if (userName && name && email && phoneNumber && adrress && password ) {
        
        for (const usuario of usuarios) {
        
            if (usuario.email === newUser.email){
                ban = true;
                next(new Error('email ya esta registrado'));
            } else if (usuario.userName === newUser.userName){
                ban = true;
                next(new Error('nombre de usuario ya esta registrado'));
            }       
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
        res.status(403).send("No puede realizar esta accion");
    }
}

function esta_registrado(req,res,next) {
    if (logueado.sign_in === false){
        res.status(403).send("Debe iniciar sesion para realizar esta accion");
    } else{
        next();
    }
}

function no_admin(req,res,next) {
    if (logueado.usuario.admin === false) {
        next();
    } else {
        res.status(403).send("Usted es un usuario administrador. No puede realizar esta accion");
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
    no_admin
}