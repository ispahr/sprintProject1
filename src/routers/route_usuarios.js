const express = require('express');
const router = express.Router();

const { validar_nueva_cuenta, errorHandler} = require("../functions/middlewares/middlewares");
const { crear_cuenta, iniciar_sesion } = require("../functions/usuarios/usuarios");

router.route('/')
    .post(validar_nueva_cuenta,errorHandler,crear_cuenta)
    .put(iniciar_sesion);

module.exports = router;