const express = require('express');
const bodyParser = require('body-parser');
const baseRoutes = require("./routes/base.route");

const db_connection = require("./config/db");
require('dotenv').config();


const app = express();

// parsing
app.use(bodyParser.json());

// db connection
db_connection();

// api routes
app.use("/api", baseRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


