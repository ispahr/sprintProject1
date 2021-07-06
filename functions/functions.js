const { usuarios,pedidos, logueado,productos } = require("../base_datos/objetos");


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
                //console.log(logueado.usuario)
                //console.log(logueado.sign_in)
                res.status(200).send("Sesion iniciada")
            }
        }
    } else{
        valido = true;
        res.status(406).send("Formato de parametros en headers no valido");
    }
    // puede iniciar sesion otro usuario sin cerrar la sesion anterior????
    
    if (valido === false) {
        res.status(406).send("Usuario no registrado")
    }
  
}

function crear_nuevo_producto(req,res) {
    const nombre = req.headers.nombre;
    const precio = Number(req.headers.precio);
    let valido = true;
    
    //console.log(isNaN(precio)+'   '+ precio)
    
    if (typeof nombre === 'string' && isNaN(precio) === false) {
        for (const producto of productos) {
            if (producto.plato === nombre){
                valido = false;
                res.status(406).send("Producto ya esta registrado");
            }
        }
        
    } else{
        valido = false;
        res.status(406).send("Formato de parametros en headers no valido. {nombre: string, precio:Number}");
    }


    if (valido === true) {
        const id = Number(productos[productos.length-1].platoID + 1);
        productos.push({
            'plato': nombre,
            'platoID': id,
            'precio': precio
        })
        // console.log(productos[productos.length-1]);
        // console.log(productos[productos.length-2]);
        res.status(200).send("Producto agregado correctaemente");
    }
}


function editar_producto(req,res) {

    const plato =  req.body.plato;
    const platoID = Number(req.body.platoID);
    const precio =  Number(req.body.precio);

    let encontrado = false;
    if ( (!!plato === false && !!precio === false) || isNaN(platoID) === true) {
        encontrado=true;
        res.status(400).send("Obligatorio: {platoID: Number} Opcional(al menos uno): {precio:Number} o {plato:string}");
    }else{
        for (const producto of productos) {
            if (producto.platoID === platoID) {
                encontrado = true;
                if (isNaN(precio) === false){
                    producto.precio = precio;
                }
                if (!!plato === true) {
                    producto.plato = plato;
                }
                //console.log(productos)
                res.status(200).send("Producto editado correctamente.");
            }
        }

    }

    if (encontrado === false) {
        res.status(404).send("platoID no encontrado.");
    }



}

function eliminar_producto(req,res) {
    const platoID = Number(req.body.platoID);
    // si quiero hacerlo con headers no me sale
    let encontrado = false;
    //console.log(isNaN(platoID)+"  "+platoID+"  "+req.body.platoID)
    if (isNaN(platoID) === true){
        encontrado = true;
        res.status(400).send("Header platoID debe ser un numero");
    }

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        if (producto.platoID === platoID) {
            encontrado = true;
            productos.splice(i,1)
            //console.log(productos)
            res.status(200).send("Producto eliminado correctamente.");
        }
    }
    
    if (encontrado === false) {
        res.status(404).send("platoID no encontrado.");
    }
        
    
}

function realizar_pedido(req,res) {
    const pedido_realizado = req.body;
    // faltan validaczciones
    // chequear que el objeto no este vacio, que las claves y los valores sean numeros

    let body_valido = true;

    if (Array.isArray(pedido_realizado) === false && typeof pedido_realizado === "object" 
        && !!pedido_realizado === true && Object.keys(pedido_realizado) !== 0) {
        const keys = Object.keys(pedido_realizado);
        const claves = Object.values(pedido_realizado);
        console.log('Es un objeto valido')

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const clave = claves[i];
            if (isNaN(key) === true || isNaN(clave) === true ) {
                body_valido = false;
            }
        }
    } else{
        body_valido = false;
        res.status(400).send("Body debe ser un Objeto con clave y valor numericas.");
    }

    // si hay un prodcuto que no lo esat en el menu, lo saltea y sigue con los demas
    if (body_valido === true) {
        const pedidoID = pedidos[pedidos.length-1].pedidoID + 1;
        pedidos.push({
            
            'pedidoID': pedidoID,
            'usuario': logueado.usuario,
            'estado': 'pendiente',
            'productos': [],
            'costo_total': 0
            })

        for (const producto of productos) {
            const productoID = producto.platoID;

            if (!!pedido_realizado[productoID] === false ){
                //console.log('producto no encontrado');
            } else{
                pedidos[pedidos.length-1].productos.push({
                    'platoID':productoID,
                    'cantidad': pedido_realizado[productoID],
                    'precio': producto.precio}) 
            }
        }

        let costo_pedido = 0;
        for (producto of pedidos[pedidos.length-1].productos){
            costo_pedido += producto.precio * producto.cantidad;
        }
        pedidos[pedidos.length-1].costo_total = costo_pedido;
        console.log(pedidos[pedidos.length-1]);
        res.status(200).send('Pedido agregado con exito')
    } else{
        console.log('Alguna de sus valores no eran numeros')
        res.status(400).send("Body debe ser un Objeto con clave y valor numericas.");
    }
}

function mostrar_pedidos(req,res) {
    const usuario = logueado.usuario.email;
    let pedidos_usuario = []
    for (const pedido of pedidos) {
        if (pedido.usuario.email === usuario) {
            pedidos_usuario.push(pedido)
        }
    }

    if (pedidos_usuario.length > 0) {
        res.status(200).send(pedidos_usuario)
    } else{
        res.status(404).send("El usuario no tiene pedidos")
    }
}

module.exports = {
    crear_cuenta,
    iniciar_sesion,
    crear_nuevo_producto,
    editar_producto,
    eliminar_producto,
    realizar_pedido,
    mostrar_pedidos
}