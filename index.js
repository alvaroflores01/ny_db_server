//Frameworks / Libraries
const express = require('express');
const dotenv = require('dotenv');
const db = require('./database/dbMethods.js')
const cors = require('cors');


//Initialize Server
const app = express();
const port = 8080;

//Config Development Environment
// process.env.VARIABLE_NAME to access your env variable.
dotenv.config();

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
        await db.testConnection();
        res.send("SUCCESS: CONNECTED")
    } catch (err) {
        res.send(err.message);
    }
    
})

app.get('/testTable', async(req, res) => {
    try {
        result = await db.getTable('*', 'totalPopulationByContinent');
        res.send(result.rows);
    } catch (err) {
        res.send(err.message);
    }

})

//LISTENING ON PORT
app.listen(port, ()=> {
    console.log(`Listening on ${port}`)
    db.testConnection();
})