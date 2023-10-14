const express = require('express');
const router = require('../../routes/base.route');
require('dotenv').config();


const app = express();

const db_connection = require("../../config/db");

app.use(express.json());

app.use('/api', router);

module.exports = async () => {
    let db = await db_connection(true);
    return {app, db};
}
