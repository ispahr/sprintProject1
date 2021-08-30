const { getModel, getSequelize } = require("../../database");
const { QueryTypes } = require('sequelize')

async function realizar_pedido(req, res) {
  const {
    mediosPagoId,
    direccioneId,
    listaProductos
  } = req.body;

  const ProductoPedido = getModel('ProductoPedido');
  const Pedidos = getModel('Pedidos');
  const userId = req.user.id;

  const newPedido = {
    estadoId: 1,
    mediosPagoId: mediosPagoId,
    direccioneId: direccioneId,
    UserId: userId,
    costoTotal: 0
  }
  // falta validacion de datos recibidos
  // no necesito una transaction por si pasa algo justo antes de crear todo?
  try {
    const ped = await Pedidos.create(newPedido);

    const pedidoId = ped.dataValues.id;
    //List of objects (key/value pairs)
    var allData = listaProductos.map(function (prod) {
      prod.pedidoId = pedidoId;
      return prod;

    });
    const todosAgregados = await ProductoPedido.bulkCreate(allData);
    const costo_total = await costoPedido(pedidoId);

    const agregarCosto = await Pedidos.update( {
      costoTotal: costo_total[0]['suma'] },
      { where:
         { id : pedidoId}
      } )
    res.status(200).send({ 'status_code': 200, 'message': 'Pedido agregado con exito' })
  } catch (error) {
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }


}
async function costoPedido(pedidoId) {
  const sequelize = getSequelize();
  const suma = await sequelize.query(
    `SELECT SUM(prod.price * pp.cantidad) as suma FROM productopedidos as pp
    JOIN productos as prod ON pp.ProductoId  = prod.id WHERE pp.pedidoId = :pedidoId`,
    {
      replacements: { pedidoId: pedidoId },
      type: QueryTypes.SELECT    }
  );

  return suma;
}

async function mostrar_pedidos(req, res) {
  const userId = req.user.id;

  const Pedidos = getModel('Pedidos');

  const find = await Pedidos.findAll({
    where: {
      UserId: userId
    },
    include: { all: true, nested: true }
  })

  if (find !== null && find !== undefined) {
    res.status(200).send(find)
  } else {
    res.status(404).send("El usuario no tiene pedidos")
  }
}

async function editar_pedido(req, res) {
  const { listaProductos } = req.body;
  const pedidoId = Number(req.headers.pedidoid);

  const Pedidos = getModel('Pedidos');
  const ProductoPedido = getModel('ProductoPedido');

  const updateData = listaProductos.map(async (producto) => {
    const found = await ProductoPedido.findOne({
      where:{
        pedidoId:pedidoId,
        ProductoId:producto.ProductoId
      }
    });
    if (!!found) {
      return ProductoPedido.update({cantidad:producto.cantidad}, {
        where:{
          pedidoId:pedidoId,
          ProductoId:producto.ProductoId
        }
      });
    } else{
        return ProductoPedido.create({
          cantidad:producto.cantidad,
          ProductoId:producto.ProductoId,
          pedidoId:pedidoId
      })
    }
  })

  const updated = await Promise.all(updateData);
  //Actualiza el costo total
  const costo_total = await costoPedido(pedidoId);

  const agregarCosto = await Pedidos.update( {
    costoTotal: costo_total[0]['suma'] },
    { where:
        { id : pedidoId}
    } )
  return res.status(200).send({ 'status_code': 200, 'message': 'Pedido actualizado.' })
}

async function eliminar_producto_de_pedido(req, res) {
  const { listaProductos } = req.body;
  const pedidoId = Number(req.headers.pedidoid);

  const ProductoPedido = getModel('ProductoPedido')
  const Pedidos = getModel('Pedidos')

  const deleteId = listaProductos.map( (producto) => {
    return ProductoPedido.destroy({ where: {
      pedidoId: pedidoId,
      ProductoId: producto.productoId
    }})

  })
  const allDestroy = await Promise.all(deleteId)
  console.log(allDestroy);
  //Actualiza el costo total
  const costo_total = await costoPedido(pedidoId);

  const agregarCosto = await Pedidos.update( {
    costoTotal: costo_total[0]['suma'] },
    { where:
        { id : pedidoId}
    } )

  return res.status(200).send({ 'status_code': 200, 'message': 'Productos eliminados.' });
}

async function estado_confirmado(req, res) {
  const pedidoID = Number(req.headers.pedidoid);
  const Pedidos = getModel('Pedidos');
  try {
    const pedido = await Pedidos.update({estadoId:2} , { where: { id: pedidoID }} );
    return res.status(200).send({ 'status_code': 200, 'message': 'Estado cambiado a confirmado', 'otro':pedido });

  } catch (error) {
    console.log(error);
    return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }

}

async function admin_modifica_pedidos(req, res) {
  const pedidoID = Number(req.headers.pedidoid);
  const nuevo_estado = Number(req.headers.nuevo_estado);
  const Pedidos = getModel('Pedidos');

  try {
    const pedido = await Pedidos.update({estadoId:nuevo_estado} , { where: { id: pedidoID }} );

    if ( pedido[0] === 0) {
      return res.status(400).send({ 'status_code': 400, 'message': 'platoID no encontrado' });

    }else {
      return res.status(200).send({ 'status_code': 200, 'message': 'Pedido modificado'});
    }
  } catch (error) {
      return res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })
  }
}

async function admin_ve_pedidos(req, res) {
  const Pedidos = getModel('Pedidos');
  try {
    const allPedidos = await Pedidos.findAll();
    res.status(400).send(allPedidos)
  } catch (error) {
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error })

  }
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
