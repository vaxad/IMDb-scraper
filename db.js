const mongoose = require('mongoose')
require('dotenv').config({path:'./.env.local'})
const uri = process.env.MONGO

const connectDB = () =>{
    try {
        mongoose.connect(uri)
        console.log('mongo connected')
    } catch (error) {
        console.log('error occured')
    }
} 

module.exports = connectDB