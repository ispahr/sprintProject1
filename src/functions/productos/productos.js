const { usuarios,pedidos, logueado,productos } = require("../../database/objetos");

function crear_nuevo_producto(req,res) {
    const nombre = req.headers.nombre;
    const precio = Number(req.headers.precio);
    let valido = true;
    
    if (typeof nombre === 'string' && isNaN(precio) === false) {
        for (const producto of productos) {
            if (producto.plato === nombre){
                valido = false;
                res.status(406).send("Producto ya esta registrado");
            }
        }
        
    } else{
        valido = false;
        res.status(406).send("Formato de parametros en headers no valido. nombre: string y precio:Number");
    }


    if (valido === true) {
        const id = Number(productos[productos.length-1].platoID + 1);
        productos.push({
            'plato': nombre,
            'platoID': id,
            'precio': precio
        })

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

    let encontrado = false;

    if (isNaN(platoID) === true){
        encontrado = true;
        res.status(400).send("Header platoID debe ser un numero");
    }

    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        if (producto.platoID === platoID) {
            encontrado = true;
            productos.splice(i,1)
            res.status(200).send("Producto eliminado correctamente.");
        }
    }
    
    if (encontrado === false) {
        res.status(404).send("platoID no encontrado.");
    }
        
    
}

module.exports = {
    crear_nuevo_producto,
    editar_producto,
    eliminar_producto
}