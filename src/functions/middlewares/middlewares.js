const { usuarios,pedidos, logueado,productos, medios_pago } = require("../../database/objetos");


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

function posicion_pedido(req,res,next) {
    const numero_pedido = Number(req.headers.pedidoid);
    const email = logueado.usuario.email;

    if (!!numero_pedido && Array.isArray(numero_pedido) === false) {
        for (const i in pedidos) {
            if (pedidos[i].pedidoID === numero_pedido ){
                if (pedidos[i].usuario.email === email) {
                    req.headers.pos_pedido = i;
                    return next();    
                } else{
                    return res.status(406).send({'status_code':406,'message':'pedidoid no corresponde al usuario'})
                }
            } 
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

function existe_producto(req,res,next) {
    const compras = req.body;

    let posiciones = [];
    let valido = false;  
    if (Array.isArray(compras) === true && compras.length > 0) {
        valido = true;
    }

    if (valido === true){    
        for (const compra of compras) {
            let encontrado = false;
            for (const i in productos) {
                if (compra.platoID === productos[i].platoID) {
                    encontrado = true;
                    posiciones.push(i);
                }
            }

            if (encontrado === false) {
                return res.status(406).send({'status_code':406,'message':'platoid debe ser un producto valido.'})
            }
        }
        req.headers.posiciones = posiciones;
        next();
    } else {
        return res.status(406).send({'status_code':406,'message':'Body debe ser: [{"platoID":Number, "cantidad":Number},]'})
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
    posicion_pedido,
    existe_producto,
    pedido_confirmado
}