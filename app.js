const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const http =require('http')
const server = http.createServer(app);
const connectDB =require('./db')
connectDB()

app.use('/imdb',require('./routes/imdb'))

app.get('/',(req,res)=>{
    res.send("working")
})

server.listen(4000, () => {
    console.log('workin')
})


