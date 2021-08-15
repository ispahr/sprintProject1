const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const doc = YAML.load('./src/functions/documentation/docu.yml');

module.exports = {
    swaggerUI,
    doc
}