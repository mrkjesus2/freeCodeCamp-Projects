let mongoose = require('mongoose')

let bookSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    comments: [{
        user: {type: String},
        comment: {type: String, required: true}
    }],
    commentCount: Number
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
})

bookSchema.virtual('commentcount').get(function() {
    return this.comments.length
})

module.exports = mongoose.model('Book', bookSchema)