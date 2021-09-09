const {
        realizar_pedido,
        mostrar_pedidos,
        admin_ve_pedidos,
        admin_modifica_pedidos,
        editar_pedido,
        eliminar_producto_de_pedido,
        estado_confirmado
} = require("../functions/pedidos/pedidos");

const { es_admin, no_admin,existe_producto,pedido_confirmado, existe_pedido, authorize, suspended } = require("../functions/middlewares/middlewares");

const express = require('express');
const router = express.Router();

router.use(authorize);

router.route("/")
    .post(no_admin, suspended,existe_producto, realizar_pedido)
    .get(no_admin , suspended, mostrar_pedidos)
    .put(no_admin, suspended, existe_pedido, existe_producto, pedido_confirmado, editar_pedido)
    .delete(no_admin, suspended, existe_pedido, pedido_confirmado, eliminar_producto_de_pedido);

router.route("/confirmado").put(no_admin, suspended,existe_pedido, estado_confirmado );

router.route("/admin")
    .get( es_admin, admin_ve_pedidos)
    .put( es_admin, admin_modifica_pedidos );

module.exports = router;
