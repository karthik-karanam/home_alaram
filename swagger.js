const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Your API',
      description: 'API documentation for your project',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'], // Update this with the path to your server.js file
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
