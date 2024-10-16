const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const ticket = require('./ticket');
const lane = require('./lane');
const auth = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));

app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  })
);

// If you would like to add a new endpoint, add it here and list the functions you want to call
// Most likely, always have auth.check as this ensures that only logged in users can change the taskboard
app.post('/v0/login', auth.login);

app.get('/v0/ticket', auth.check, ticket.get);
app.post('/v0/ticket', auth.check, ticket.move);

app.get('/v0/lane', auth.check, lane.get);
app.post('/v0/lane', auth.check, lane.move);
app.delete('/v0/lane', auth.check, lane.delete);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
