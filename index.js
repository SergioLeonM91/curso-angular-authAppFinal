const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
require('dotenv').config();

const app = express();

app.use( express.static('public') );

app.use( cors() );

app.use( express.json() );

app.use( '/api/auth', require('./routes/auth') );

app.get( '*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') );
})

dbConnection();

app.listen( process.env.PORT, () => {
    console.log(`Server run on port ${ process.env.PORT }`);
});