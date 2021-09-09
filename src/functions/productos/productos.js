const { getModel } = require("../../database");
const { writeCache, deleteCache } = require("../middlewares/middlewareCache");

async function crear_nuevo_producto(req, res) {
  const nombre = req.headers.nombre;
  const precio = Number(req.headers.precio);
  let valido = true;
  try {

    const Productos = getModel('Productos');

    if (typeof nombre === 'string' && isNaN(precio) === false) {
      const find = await Productos.findOne({ where: { name: nombre } })

      if (find !== null) {
        valido = false;
        return res.status(406).send("Producto ya esta registrado");
      }

    } else {
      valido = false;
      return res.status(406).send("Formato de parametros en headers no valido. nombre: string y precio:Number");
    }


    if (valido === true) {
      await Productos.create({
        'name': nombre,
        'price': precio
      })
      deleteCache({
        method: 'GET',
        baseUrl: req.baseUrl,
      })
      res.status(200).send("Producto agregado correctaemente");
    }
  } catch (error) {
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }
}


async function editar_producto(req, res) {

  const plato = req.body.plato;
  const platoID = Number(req.body.platoID);
  const precio = Number(req.body.precio);

  let encontrado = false;
  try {
    const Productos = getModel('Productos');

    if ((!!plato === false && !!precio === false) || isNaN(platoID) === true) {
      encontrado = true;
      return res.status(400).send("Obligatorio: {platoID: Number} Opcional(al menos uno): {precio:Number} o {plato:string}");
    } else {
      const find = await Productos.findOne({ where: { id: platoID } })

      if (find !== null) {
        encontrado = true;
        if (isNaN(precio) === false) {
          find.price = precio;
        }
        if (!!plato === true) {
          find.name = plato;
        }
        await find.save()
        deleteCache({
          method: 'GET',
          baseUrl: req.baseUrl,
        })
        res.status(200).send("Producto editado correctamente.");
      }

    }

  } catch (error) {
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }

  if (encontrado === false) {
    res.status(404).send("platoID no encontrado.");
  }
}

async function eliminar_producto(req, res) {
  const platoID = Number(req.body.platoID);

  const Productos = getModel('Productos');
  let encontrado = false;

  if (isNaN(platoID) === true) {
    encontrado = true;
    return res.status(400).send("Header platoID debe ser un numero");
  }
  try {
    const toDelete = await Productos.destroy({ where: { id: platoID } });
    if (toDelete === 1) {
      encontrado = true;
      deleteCache({
        method: 'GET',
        baseUrl: req.baseUrl,
      })
      return res.status(200).send("Producto eliminado correctamente.");
    }

  } catch (error) {
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });

  }

  if (encontrado === false) {
    res.status(404).send("platoID no encontrado.");
  }


}

async function mostrarProductos(req, res) {
  const Productos = getModel('Productos');
  try {
    const allProducts = await Productos.findAll();
    writeCache(allProducts, req);
    res.status(200).send(allProducts)

  } catch (error) {
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })

  }
}

module.exports = {
  crear_nuevo_producto,
  editar_producto,
  eliminar_producto,
  mostrarProductos
}
