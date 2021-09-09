const express = require('express');
const router = express.Router();

const { validar_nueva_cuenta, errorHandler, no_admin, authorize, es_admin, suspended} = require("../functions/middlewares/middlewares");
const { getAddresses, addAddress } = require('../functions/usuarios/direcciones');
const { crear_cuenta, iniciar_sesion, suspendUser } = require("../functions/usuarios/usuarios");

router.route('/')
    .post(validar_nueva_cuenta,errorHandler,crear_cuenta)
    .put(iniciar_sesion);

router.route('/direcciones')
  .post( authorize , suspended, no_admin, addAddress)
  .get( authorize , suspended, no_admin, getAddresses)

router.route('/admin').put(authorize, es_admin, suspendUser)

module.exports = router;
