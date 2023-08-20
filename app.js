const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const http =require('http')
const server = http.createServer(app);

app.use('/imdb',require('./routes/imdb'))

server.listen(4000, () => {
    console.log('workin')
})


