const express = require('express');
const router = express.Router();

const { validar_nueva_cuenta, errorHandler, no_admin, authorize} = require("../functions/middlewares/middlewares");
const { getAddresses, addAddress } = require('../functions/usuarios/direcciones');
const { crear_cuenta, iniciar_sesion } = require("../functions/usuarios/usuarios");

router.route('/')
    .post(validar_nueva_cuenta,errorHandler,crear_cuenta)
    .put(iniciar_sesion);

router.route('/direcciones')
  .post( authorize , no_admin, addAddress)
  .get( authorize , no_admin, getAddresses)

module.exports = router;
