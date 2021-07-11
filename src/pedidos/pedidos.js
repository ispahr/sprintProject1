const { usuarios,pedidos, logueado,productos } = require("../database/objetos");

function realizar_pedido(req,res) {
    const pedido_realizado = req.body;
    const posiciones = req.headers.posiciones;
    
    const pedidoID = pedidos[pedidos.length-1].pedidoID + 1;
    // creamos el pedido
    pedidos.push({
        
        'pedidoID': pedidoID,
        'usuario': logueado.usuario,
        'estado': 'pendiente',
        'productos': [],
        'costo_total': 0
        })
    // agregamos los datos de los productos
    for (const i in posiciones) {
        const pos = posiciones[i];

        const cantidad = pedido_realizado[i].cantidad;
        const productoID = productos[pos].platoID;
        const precio = productos[pos].precio;

        pedidos[pedidos.length-1].productos.push({
            'platoID': productoID,
            'cantidad': cantidad,
            'precio': precio}) 
    }

    //Actualiza el costo total
    let costo_pedido = 0;
    for (producto of pedidos[pedidos.length-1].productos){
        costo_pedido += producto.precio * producto.cantidad;
    }
    pedidos[pedidos.length-1].costo_total = costo_pedido;
    
    res.status(200).send({'status_code':200,'message':'Pedido agregado con exito'})

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

function editar_pedido(req,res) {
    const compras = req.body;
    const numero_pedido = req.headers.pedidoid;
    const pos_pedido = Number(req.headers.pos_pedido);
    const posiciones = req.headers.posiciones;

    const pedido = pedidos[pos_pedido].productos;
    for (const i in compras) {
        let encontrado = false;
        const compra= compras[i];

        for (const producto of pedido) {
            if (compra.platoID === producto.platoID) {
                encontrado = true;
                producto.cantidad = compra.cantidad;
            }
        }

        if (encontrado === false) {
            const pos = posiciones[i];
            pedido.push({
                'plaotID': compra.platoID,
                'cantidad':compra.cantidad , 
                'precio':productos[pos].precio})
        }
    }
    //Actualiza el costo total
    let costo_pedido = 0;
    for (producto of pedido){
        costo_pedido += producto.precio * producto.cantidad;
    }
    pedidos[pos_pedido].costo_total = costo_pedido;
    
    return res.status(200).send({'status_code':200,'message':'Pedido actualizado.'})
}

function eliminar_producto_de_pedido(req,res) {
    const pos_pedido = Number(req.headers.pos_pedido);
    const lista_eliminar = req.body;

    const pedido = pedidos[pos_pedido].productos;
    
    for (const i in pedido) {
        for (const eliminar of lista_eliminar) {
            if (pedido[i].platoID === eliminar){
                pedido.splice(i,1);
            }
            
        }
    }
    //Actualiza el costo total
    let costo_pedido = 0;
    for (producto of pedido){
        costo_pedido += producto.precio * producto.cantidad;
    }
    pedidos[pos_pedido].costo_total = costo_pedido;
    
    return res.status(200).send({'status_code':200,'message':'Productos eliminados.'});
}

function estado_confirmado(req,res) {
    const pos_pedido = Number(req.headers.pos_pedido);
    pedidos[pos_pedido].estado = 'confirmado';

    return res.status(200).send({'status_code':200,'message':'Estado cambiado a confirmado'});
}

function admin_modifica_pedidos(req,res) {
    const pedidoID = Number(req.headers.pedidoid);
    const nuevo_estado = req.headers.nuevo_estado;
    let encontrado = false;

    for (const pedido of pedidos) {
        if (pedido.pedidoID === pedidoID) {
            encontrado = true;
            pedido.estado = nuevo_estado;
            return res.status(200).send({'status_code':200,'message':'Pedido modificado'})
        }
    }

    if (encontrado === false) {
        return res.status(400).send({'status_code':400,'message':'platoID no encontrado'})
    }
}

function admin_ve_pedidos (req,res) {
    res.status(200).send(pedidos)
}

module.exports = {
    admin_modifica_pedidos,
    admin_ve_pedidos,
    mostrar_pedidos,
    realizar_pedido,
    editar_pedido,
    eliminar_producto_de_pedido,
    estado_confirmado
}