const express = require('express');
const router = express.Router();

const {swaggerUI, doc } = require("../functions/documentation/docu_swagger")

router.use(swaggerUI.serve, swaggerUI.setup(doc));

module.exports = router;