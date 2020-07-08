let mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    comments: [{
        user: {type: String},
        comment: {type: String, required: true}
    }]
})

module.exports = mongoose.model('Book', bookSchema)