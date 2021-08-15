const express = require('express');
const { esta_registrado, es_admin } = require('../functions/middlewares/middlewares');
const { mostrar_medios_pago, agregar_medio_pago, editar_medio_pago, eliminar_medio_pago } = require('../functions/medios_de_pago/medios_pago');

const router = express.Router();

router.use( esta_registrado, es_admin);

router.get('/', mostrar_medios_pago );
router.post('/', agregar_medio_pago);
router.put('/', editar_medio_pago);
router.delete('/', eliminar_medio_pago);


module.exports = router;