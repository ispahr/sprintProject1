const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const doc = YAML.load('./src/documentation/docu.yml');

module.exports = {
    swaggerUI,
    doc
}