const yaml = require('js-yaml');
const fs = require('fs');
const swaggerUI = require('swagger-ui-express');
const file = './docu.yml'
const doc = yaml.load(fs.readFileSync(file, 'utf-8'));




module.exports = {
    swaggerUI,
    doc
}