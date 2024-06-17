const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path")

const indexRouter = require("./routes/index.js")
const loginRouter = require("./routes/login.js")
const productsRouter = require("./routes/products");
const { swaggerUi, swaggerSpec } = require("./swagger.js");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //แก้undefinedได้
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/login", loginRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
