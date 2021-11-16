const path = require('path');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const doc = YAML.load(path.resolve()+'/sprintProject1/src/functions/documentation/docu.yml');

console.log(doc);
module.exports = {
    swaggerUI,
    doc
}
