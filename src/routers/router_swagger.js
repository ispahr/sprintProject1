const express = require('express');
const router = express.Router();

const {swaggerUI, doc } = require("../../docu_swagger")

router.route('/').get(swaggerUI.serve, swaggerUI.setup(doc));


module.exports = router;