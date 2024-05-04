


const express = require('express')
const cors = require('cors')
const route = require('./src/routes')
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
route(app)


const PORT = process.env.PORT
const HOST = 'localhost';

app.listen(PORT, () => {
    console.log(`Running on`);
});






