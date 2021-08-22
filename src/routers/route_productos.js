const express = require('express');
const router = express.Router();

const { crear_nuevo_producto, editar_producto, eliminar_producto } = require("../functions/productos/productos");
const {es_admin, esta_registrado } = require("../functions/middlewares/middlewares");

router.use(esta_registrado, es_admin );

router.route('/')
    .post( crear_nuevo_producto )
    .put( editar_producto )
    .delete( eliminar_producto );

module.exports = router;      