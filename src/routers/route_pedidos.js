const { 
        realizar_pedido,
        mostrar_pedidos,
        admin_ve_pedidos,
        admin_modifica_pedidos,
        editar_pedido,
        eliminar_producto_de_pedido,
        estado_confirmado
} = require("../pedidos/pedidos");

const { es_admin, esta_registrado, no_admin, posicion_pedido,existe_producto,pedido_confirmado } = require("../middlewares/middlewares");

const express = require('express');
const router = express.Router();

router.use(esta_registrado);

router.route("/")
    .post(no_admin,existe_producto, realizar_pedido)
    .get(no_admin, mostrar_pedidos)
    .put(no_admin, posicion_pedido, pedido_confirmado, existe_producto, editar_pedido)
    .delete(no_admin, posicion_pedido, pedido_confirmado, eliminar_producto_de_pedido);

router.route("/confirmado").put(no_admin,posicion_pedido, estado_confirmado );

router.route("/admin")
    .get( es_admin, admin_ve_pedidos)
    .put( es_admin, admin_modifica_pedidos );

module.exports = router;