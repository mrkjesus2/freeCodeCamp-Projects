const { Schema } = require("mongoose");

let mongoose = require('mongoose')

const USERSCHEMA = new Schema({
    name: {type: String, required: true, unique: true},
    exercises: [{
        description: {type: String, required: true},
        duration: {type: Number, required: true},
        date: {type: Date}
    }]
})

module.exports = mongoose.model('User', USERSCHEMA)