const express = require('express');
const app = express();
const port = 4000;


// API ENDPOINTS
app.get('/', (req, res) => {
    res.send('Hello World');
})

//LISTENING ON PORT
app.listen(port, ()=> {
    console.log(`Listening on ${port}`)
})