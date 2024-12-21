const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Dissertation Management API',
    version: '1.0.0',
    description: 'API for managing dissertations',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }], // Applies bearerAuth globally
  servers: [{ url: 'http://localhost:3000' }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
