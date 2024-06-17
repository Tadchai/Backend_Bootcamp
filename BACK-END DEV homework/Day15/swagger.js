const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "API ตัวอย่างสำหรับ Products ",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: [
            "id",
            "name",
            "price",
            "discount",
            "review_count",
            "image_url",
          ],
          properties: {
            id: {
              type: "integer",
              description: "The auto-generated id of the product",
            },
            name: { type: "string", description: "The product name" },
            price: { type: "number", description: "The product price" },
            discount: { type: "number", description: "The product discount" },
            review_count: {
              type: "integer",
              description: "The product review count",
            },
            image_url: { type: "string", description: "The product image URL" },
          },
        },
      },
    },
  },
  apis: ["./routes/products.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
