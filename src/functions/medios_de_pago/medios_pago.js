const { getModel } = require('../../database');

async function mostrar_medios_pago(req, res) {
  try {
    const mediosPago = getModel('MedioPago');
    const all = await mediosPago.findAll( { attributes: ['id','name'] } );
    res.status(200).send(all);
    
  } catch (error) {
    
    res.status(400).send({'status_code':400,'message':'Error in the database'}, error);
  }
}

async function agregar_medio_pago(req, res) {
  const nuevo =  req.headers.nuevo;

  const mediosPago = getModel('MedioPago');
  try {
    const one = await mediosPago.findOne({where: {name:nuevo}})
    
    if (one === null) {
      await mediosPago.create({name:nuevo});
      
      return res.status(200).send({status_code:200, message:"Medio de pago editado correctamente."});
    } else {
      return res.status(406).send({'status_code':406,'message':'El medio de pago ya esta cargado'})
      
    }
    
  } catch (error) {
    
    res.status(400).send({'status_code':400,'message':'Error in the database'}, error);
  }
  
}

async function editar_medio_pago(req, res) {
  const nuevo_nombre = req.headers.nuevo_nombre;
  const medio_id = Number(req.headers.medio_id);
  
  const mediosPago = getModel('MedioPago');
  try {
    const one = await mediosPago.findOne({where: { id: medio_id } });

    if (one !== null) {
      const updated = await mediosPago.update({ name: nuevo_nombre }, {
        where: {
          id: medio_id
        }
      })
      return res.status(200).send({status_code:200, message:"Medio de pago editado correctamente."});
      
    } else {
      return res.status(406).send({'status_code':406,'message':'El medio de pago ID no existe'})
      
    }
    
  } catch (error) {
    
    res.status(400).send({'status_code':400,'message':'Error in the database'}, error);
  }
  
}

async function eliminar_medio_pago(req, res) {
  
  const medio_id = Number(req.headers.medio_id);
  const mediosPago = getModel('MedioPago');
  
  try {
    const one = await mediosPago.destroy({ where: { id: medio_id } });
    console.log(one)
    if (one === 1) {
      return res.status(200).send({status_code:200, message:"Medio de pago eliminado correctamente."});
      
    } else {
      return res.status(406).send({'status_code':406,'message':'El medio de pago ID no existe'})
      
    }

  } catch (error) {
    
    res.status(400).send({'status_code':400,'message':'Error in the database'}, error);
  }
  
}

module.exports = {
    mostrar_medios_pago,
    agregar_medio_pago,
    editar_medio_pago,
    eliminar_medio_pago
}