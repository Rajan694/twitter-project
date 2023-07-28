
const { Client } = require('pg');
require('dotenv').config();


const client = new Client({
    host: process.env.hostname,
    user: process.env.username,
    port: process.env.port,
    password: process.env.password,
    database: process.env.database

});

client.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("db connected");
  }
});

module.exports = client;
