const express = require('express');
const { esta_registrado, es_admin, existe_medio } = require('../middlewares/middlewares');
const { mostrar_medios_pago, agregar_medio_pago, editar_medio_pago, eliminar_pedido_pago } = require('../medios_de_pago/medios_pago');

const router = express.Router();

router.use( esta_registrado, es_admin);

router.get('/', mostrar_medios_pago );
router.post('/', agregar_medio_pago);
router.put('/',existe_medio, editar_medio_pago);
router.delete('/', existe_medio, eliminar_pedido_pago);


module.exports = router;