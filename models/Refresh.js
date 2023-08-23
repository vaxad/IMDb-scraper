const {Schema, model} = require('mongoose')

const rSchema = new Schema({
    date : {
        type:Date,
        default:Date.now()
    }
})

const Refresh = model('refresh',rSchema)

module.exports = Refresh