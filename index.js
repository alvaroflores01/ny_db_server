//Frameworks / Libraries
const express = require('express');
const dotenv = require('dotenv');
const db = require('./database/dbMethods.js')
const cors = require('cors');

//Database Requirements

//Initialize Express
const app = express();

//Config Development Environment
// process.env.VARIABLE_NAME to access your env variable.
dotenv.config();


const port = 300;

//DATABASE CONNECTION
// const db = dbtest();

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
        result = await db.getTable('*', 'toycarorders');
        res.send(result.rows);
    } catch (err) {
        res.send(err.message);
    }

})

//LISTENING ON PORT
app.listen(port, ()=> {
    console.log(`Listening on ${port}`)
})