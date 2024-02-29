//Frameworks / Libraries
const express = require('express');
const dotenv = require('dotenv');
const oracledb = require('oracledb');
const dbconfig = require('./database/dbconfig.js');
const cors = require('cors');

//Database Requirements
const dbtest = require('./database/dbtest.js');

//Initialize Express
const app = express();

//Config Development Environment
// process.env.VARIABLE_NAME to access your env variable.
dotenv.config();


const port = 300;

//DATABASE CONNECTION

// MIDDLEWARE
//express json - allows express to read JSON code
app.use(express.json());
//cors - allows api to be reached by specified client
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))


// API ENDPOINTS
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/testdb', async (req, res) => {
    try {
        await dbtest();
        res.send("SUCCESS: CONNECTED")
    } catch (err) {
        res.send(err.message);
    }
    
})

//TEST DATABSE CONNECTION


//LISTENING ON PORT
app.listen(port, ()=> {
    console.log(`Listening on ${port}`)
})