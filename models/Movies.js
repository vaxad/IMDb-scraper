const {Schema, model} = require('mongoose')

const movieSchema = new Schema({
    movies:[{
        title:String,
        desc:String,
        rank:Number,
        year:String,
        stars:String,
        genre:[String],
        id:String
    }]
})

const Movies = model('movies',movieSchema)

module.exports = Movies