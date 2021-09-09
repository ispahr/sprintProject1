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
  const sequelize = getSequelize()

  const t = await sequelize.transaction();
  try {

    const ped = await Pedidos.create(newPedido, { transaction: t });

    const pedidoId = ped.dataValues.id;
    //List of objects (key/value pairs)
    console.log(pedidoId);
    var allData = listaProductos.map(function (prod) {
      prod.pedidoId = pedidoId;
      return prod;

    });
    const todosAgregados = await ProductoPedido.bulkCreate(allData, { transaction: t });
    const costo_total = await costoPedido(pedidoId, t);
    console.log(costo_total);
    const agregarCosto = await Pedidos.update( {
      costoTotal: costo_total[0]['suma'] },
      { where:
         { id : pedidoId} ,
         transaction: t
      }
    )

    await t.commit();
    res.status(200).send({ 'status_code': 200, 'message': 'Pedido agregado con exito' })
  } catch (error) {

    await t.rollback();
    console.log(error);
    res.status(400).send({ 'status_code': 400, 'message': 'Error in the database', 'error': error });
  }


}
async function costoPedido(pedidoId, transaction = null) {
  const sequelize = getSequelize();
  try {
    const suma = await sequelize.query(
      `SELECT SUM(prod.price * pp.cantidad) as suma FROM productopedidos as pp
      JOIN productos as prod ON pp.ProductoId  = prod.id WHERE pp.pedidoId = :pedidoId`,
      {
        replacements: { pedidoId: pedidoId },
        type: QueryTypes.SELECT,
        transaction:transaction
      }
    );
    return suma;

  } catch (error) {
    console.log(error);
  }

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

  const sequelize = getSequelize();
  const t = await sequelize.transaction();
  try {
    const updateData = listaProductos.map(async (producto) => {
      const found = await ProductoPedido.findOne({
        where:{
          pedidoId:pedidoId,
          ProductoId:producto.ProductoId
        },
        transaction: t
      });
      if (!!found) {
        return ProductoPedido.update({cantidad:producto.cantidad}, {
          where:{
            pedidoId:pedidoId,
            ProductoId:producto.ProductoId
          },
          transaction: t
        });
      } else{
          return ProductoPedido.create({
            cantidad:producto.cantidad,
            ProductoId:producto.ProductoId,
            pedidoId:pedidoId
        }, {
          transaction: t
        })
      }
    })

    const updated = await Promise.all(updateData);
    //Actualiza el costo total
    const costo_total = await costoPedido(pedidoId, t);

    const agregarCosto = await Pedidos.update( {
      costoTotal: costo_total[0]['suma'] },
      { where:
          { id : pedidoId},
        transaction: t
      }
    )

    await t.commit();
    return res.status(200).send({ 'status_code': 200, 'message': 'Pedido actualizado.' })

  } catch (error) {
      await t.rollback();
      return res.status(400).send({ 'status_code': 400, 'Error_message': error.message })

    }
}

async function eliminar_producto_de_pedido(req, res) {
  const { listaProductos } = req.body;
  const pedidoId = Number(req.headers.pedidoid);
  const ProductoPedido = getModel('ProductoPedido')
  const Pedidos = getModel('Pedidos')

  const sequelize = getSequelize();
  const t = await sequelize.transaction();
  try {
    const deleteId = listaProductos.map( (producto) => {
      return ProductoPedido.destroy({
        where: {
          pedidoId: pedidoId,
          ProductoId: producto.productoId
        },
        transaction: t
      })
    })
    const allDestroy = await Promise.all(deleteId)
    //Actualiza el costo total
    const costo_total = await costoPedido(pedidoId, t);

    const agregarCosto = await Pedidos.update( {
      costoTotal: costo_total[0]['suma'] },{
      where:
          { id : pedidoId},
          transaction: t
      }
    )
    await t.commit();
    return res.status(200).send({ 'status_code': 200, 'message': 'Productos eliminados.' });
  } catch (error) {
    await t.rollback  ();
    return res.status(400).send({ 'status_code': 400, 'Error_message': error.message })
  }
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
