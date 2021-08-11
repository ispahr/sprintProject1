const { medios_pago } = require('../database/objetos')


function mostrar_medios_pago(req, res) {

  res.status(200).send(medios_pago);
}

function agregar_medio_pago(req, res) {
  const nuevo =  req.headers.nuevo;

  for (const medio of medios_pago) {
    if (medio.nombre === nuevo) {
      return res.status(406).send({'status_code':406,'message':'El medio de pago ya esta cargado'})
    }
  }
  const ultimo = medios_pago[medios_pago.length -1];

  medios_pago.push(
    {
      id:ultimo.id + 1,
      nombre:nuevo
    }
  )
    
  return res.status(200).send({status_code:200, message:"Medio de pago editado correctamente."});
}

function editar_medio_pago(req, res) {
  const nuevo_nombre = req.headers.nuevo_nombre;
  const existe_medio = Number(req.headers.pos_medio_pago);
  
  medios_pago[existe_medio].nombre = nuevo_nombre;
  return res.status(200).send({status_code:200, message:"Medio de pago editado correctamente."});
  
}

function eliminar_pedido_pago(req, res) {
  const existe_medio = Number(req.headers.pos_medio_pago);

  medios_pago.splice(existe_medio,1)
  return res.status(200).send({status_code:200, message:"Medio de pago eliminado correctamente."});
}

module.exports = {
    mostrar_medios_pago,
    agregar_medio_pago,
    editar_medio_pago,
    eliminar_pedido_pago
}