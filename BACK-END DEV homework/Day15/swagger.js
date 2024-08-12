const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "DAY15 API",
      version: "1.0.0",
      description: "API ตัวอย่างสำหรับ DAY15 ",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Products: {
          type: "object",
          required: [
            "Product_ID",
            "Product_Name",
            "Description",
            "Price",
            "Quantity",
          ],
          properties: {
            Product_ID: { type: "integer", description: "The auto-generated id of the product" },
            Product_Name: { type: "string", description: "The product name" },
            Description: { type: "string", description: "The product description" },
            Price: { type: "integer", description: "The product price" },
            Quantity: { type: "string", description: "The product quantity" },
          },
        },

        Users: { 
          type: "object",
          required: ["User_ID", "Username", "Password", "Email", "Role", "googleId", "facebookId"],
          properties: {
            User_ID: { type: "integer", description: "The auto-generated id of the user" },
            Username: { type: "string", description: "The user name" },
            Password: { type: "string", description: "The user password" },
            Email: { type: "string", description: "The user email" },
            Role: { type: "string", description: "The user role" },
            googleId: { type: "integer", description: "The user googleId" },
            facebookId: { type: "integer", description: "The user facebookId" },
          },
        },

        Orders: { 
          type: "object",
          required: ["Ordes_ID", "Order_Date", "Order_Status", "Product_ID", "User_ID"],
          properties: {
            Ordes_ID: { type: "integer", description: "The auto-generated id of the order" },
            Order_Date: { type: "string", format: "date-time", description: "The order date" },
            Order_Status: { type: "string", description: "The order status" },
            Product_ID: { type: "integer", description: "The id product" ,allOf: [
              { $ref: '#/components/schemas/Products/properties/Product_ID' }
            ]},
            User_ID: { type: "integer", description: "The id user" ,allOf: [
              { $ref: '#/components/schemas/Users/properties/User_ID' }
            ]},
          },
        },
      },
    },
  },
  apis: ["./routes/products.js", "./routes/login.js", "./routes/loginOauth.js", "./routes/repassword.js"],

};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
