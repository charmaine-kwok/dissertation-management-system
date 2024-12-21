const app = require('./app');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
