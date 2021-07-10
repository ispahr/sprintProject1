const { usuarios,pedidos, logueado,productos } = require("../database/objetos");

function realizar_pedido(req,res) {
    const pedido_realizado = req.body;
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
        //console.log(pedidos[pedidos.length-1]);
        res.status(200).send('Pedido agregado con exito')
    } else{
        //console.log('Alguna de sus valores no eran numeros')
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

function admin_modifica_pedidos(req,res) {
    const pedidoID = Number(req.headers.pedidoid);
    const nuevo_estado = req.headers.nuevo_estado;
    let encontrado = false;
    //console.log(pedidoID + '  ' + nuevo_estado)

    for (const pedido of pedidos) {
        if (pedido.pedidoID === pedidoID) {
            encontrado = true;
            pedido.estado = nuevo_estado;
            //console.log(pedido)
            return res.status(200).send('Pedido modificado')
        }

    }

    if (encontrado === false) {
        return res.status(400).send('platoID no encontrado')
    }
}

function admin_ve_pedidos (req,res) {
    res.status(200).send(pedidos)
}

module.exports = {
    admin_modifica_pedidos,
    admin_ve_pedidos,
    mostrar_pedidos,
    realizar_pedido
}