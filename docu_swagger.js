const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const doc = yaml.load(fs.readFileSync('./docu.yml', 'utf-8'));




module.exports = {
    swaggerUI,
    doc
}