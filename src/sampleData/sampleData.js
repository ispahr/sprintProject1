const { getModel } = require("../database/index");


async function createSampleData() {
  const Usuarios = getModel('Usuarios');
  const Estado = getModel('Estado');
  const Productos = getModel('Productos');
  const MedioPago = getModel('MedioPago');
  const Direcciones = getModel('Direcciones');
  const Pedidos = getModel('Pedidos');
  const ProductoPedido = getModel('ProductoPedido');

  try {

    await Usuarios.bulkCreate([{
        "userName": "juan",
        "name": "juan",
        "email": "juan@gmail.com",
        "phoneNumber": "987654321",
        "password": "a3366913d38ec46bab38c3e7bec4d73f9b390c8a82fd4c97891a19afc1a02c8f"
      },{
        "userName": "pepito",
        "name": "pepito",
        "email": "pepito@gmail.com",
        "phoneNumber": "123456789",
        "password": "86fd5849c36dfebed9093dc89b7c10f3d39155f54e5cc692a43f08fd0bcedd37",
        "admin": true
      }
    ])

    await Estado.bulkCreate([{name:'pendiente'}, {name:'confirmado'}, {name:'en proceso'}])
    await MedioPago.bulkCreate([{name:'Efectivo'}, {name:'Tarjeta'}, {name:'Mercado Pago'}])
    await Direcciones.create({direccion: 'Calle falsa 123', UserId:1, default:true})
    await Productos.bulkCreate([{name:'Hamburguesa' , price: 100}, {name:'Pizza' , price: 200}, {name:'Bebida' , price: 50}])
  } catch(error) {
    console.log(error);
    throw new Error(error)
  }
}

module.exports = {
  createSampleData
}
