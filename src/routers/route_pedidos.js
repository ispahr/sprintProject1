const { 
        realizar_pedido,
        mostrar_pedidos,
        admin_ve_pedidos,
        admin_modifica_pedidos 
} = require("../pedidos/pedidos");

const { es_admin, esta_registrado, no_admin } = require("../middlewares/middlewares");

const express = require('express');
const router = express.Router();

router.route("/")
    .post(esta_registrado,no_admin, realizar_pedido)
    .get(esta_registrado,no_admin, mostrar_pedidos);
    //put (que permita editar pedido)
    //delete (que permita borrar un producto)
router.route("/admin")
    .get(esta_registrado, es_admin, admin_ve_pedidos)
    .put(esta_registrado, es_admin,admin_modifica_pedidos );

module.exports = router;