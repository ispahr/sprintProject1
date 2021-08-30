const express = require('express');
const router = express.Router();

const { crear_nuevo_producto, editar_producto, eliminar_producto, mostrarProductos } = require("../functions/productos/productos");
const {es_admin, authorize } = require("../functions/middlewares/middlewares");

router.use(authorize );

router.route('/')
    .post( es_admin, crear_nuevo_producto )
    .put(es_admin, editar_producto )
    .delete( es_admin, eliminar_producto )
    .get( mostrarProductos );

module.exports = router;
